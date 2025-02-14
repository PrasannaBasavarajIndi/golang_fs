package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Config
var mongoUri string = "mongodb://localhost:27017"
var mongoDbName string = "contact_book_db"
var mongoCollectionName string = "contacts"

// Database variables
var mongoclient *mongo.Client
var contactCollection *mongo.Collection

// Model Contact for Collection "contacts"
type Contact struct {
	ID      primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name    string             `json:"name" bson:"name"`
	Phone   string             `json:"phone" bson:"phone"`
	Email   string             `json:"email" bson:"email"`
	Address string             `json:"address" bson:"address"`
}

// Connect to MongoDB
func connectDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	mongoclient, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoUri))
	if err != nil {
		log.Fatal("MongoDB Connection Error:", err)
	}

	contactCollection = mongoclient.Database(mongoDbName).Collection(mongoCollectionName)
	fmt.Println("Connected to MongoDB!")
}

// POST /contacts (Create Contact)
func createContact(c *gin.Context) {
	var newContact Contact

	if err := c.BindJSON(&newContact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := contactCollection.InsertOne(ctx, newContact)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create contact"})
		return
	}

	newContact.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Contact created successfully",
		"contact": newContact,
	})
}

// GET /contacts (Read All Contacts)
func readAllContacts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := contactCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contacts"})
		return
	}
	defer cursor.Close(ctx)

	contacts := []Contact{}
	if err := cursor.All(ctx, &contacts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse contacts"})
		return
	}

	c.JSON(http.StatusOK, contacts)
}

// GET /contacts/:id (Read Contact by ID)
func readContactById(c *gin.Context) {
	id := c.Param("id")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var contact Contact
	err = contactCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&contact)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}

	c.JSON(http.StatusOK, contact)
}

// PUT /contacts/:id (Update Contact)
func updateContact(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var updateData Contact
	if err := c.BindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var existingContact Contact
	err = contactCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&existingContact)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}

	if updateData.Name != "" {
		existingContact.Name = updateData.Name
	}
	if updateData.Phone != "" {
		existingContact.Phone = updateData.Phone
	}
	if updateData.Email != "" {
		existingContact.Email = updateData.Email
	}
	if updateData.Address != "" {
		existingContact.Address = updateData.Address
	}

	result, err := contactCollection.UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": existingContact})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contact"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Contact updated successfully",
		"contact": existingContact,
	})
}

// DELETE /contacts/:id (Delete Contact)
func deleteContact(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := contactCollection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contact"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contact deleted successfully"})
}

func main() {
	connectDB()

	r := gin.Default()

	// CORS Configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	r.POST("/contacts", createContact)
	r.GET("/contacts", readAllContacts)
	r.GET("/contacts/:id", readContactById)
	r.PUT("/contacts/:id", updateContact)
	r.DELETE("/contacts/:id", deleteContact)

	// Start server
	r.Run(":8080")
}
