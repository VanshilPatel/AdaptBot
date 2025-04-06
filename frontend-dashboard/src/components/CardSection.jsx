import { useState } from "react";
import FileUploadModal from "./FileUploadModal";
import "./CardSection.css";

const cards = [
  {
    title: "Healthcare AI Chatbot",
    subtitle: "Revolutionizing Patient Care",
    description: "An AI-driven chatbot for assisting healthcare professionals and patients.",
    image: "healthcare.jpg",
  },
  {
    title: "Finance AI Assistant",
    subtitle: "Smart Financial Decisions",
    description: "AI chatbot for loan approvals, credit analysis, and personal finance management.",
    image: "finance.jpg",
  },
  {
    title: "Education AI Tutor",
    subtitle: "Personalized Learning Experience",
    description: "AI-powered tutor to help students with queries, exam prep, and skill development.",
    image: "education.jpg",
  },
  {
    title: "E-commerce AI Assistant",
    subtitle: "Boosting Online Shopping",
    description: "Chatbot for personalized shopping, recommendations, and customer support.",
    image: "ecommerce.jpg",
  },
  {
    title: "Retail AI Assistant",
    subtitle: "Optimizing Customer Engagement",
    description: "AI chatbot for product recommendations, support, and order tracking in retail.",
    image: "retail.jpg",
  },
  {
    title: "Travel AI Guide",
    subtitle: "Your Virtual Travel Assistant",
    description: "AI chatbot for trip planning, flight bookings, and local recommendations.",
    image: "travel.jpg",
  },
];

const CardSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

 
  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 3) % cards.length);
  };

  
  const prevCard = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 3 + cards.length) % cards.length
    );
  };

  return (
    <div className="card-section">
      <div className="container">
        <h2>Our AI Chatbot Solutions</h2>
        <p className="section-description">
          Empowering multiple industries with AI-driven chatbot solutions.
        </p>

        <div className="carousel">
          <div className="card-grid">
            {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
              <div key={index} className="card">
                <img src={card.image} alt={card.title} className="card-image" />
                <div className="card-content">
                  <h3>{card.title}</h3>
                  <h4>{card.subtitle}</h4>
                  <p>{card.description}</p>
                  <button onClick={() => openModal(card)}>Upload</button>
                </div>
              </div>
            ))}
          </div>

     
          <div className="carousel-nav">
            <button className="prev" onClick={prevCard}>
              &#8249; 
            </button>
            <button className="next" onClick={nextCard}>
              &#8250; 
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <FileUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cardTitle={selectedCard?.title}
        />
      )}
    </div>
  );
};

export default CardSection;
