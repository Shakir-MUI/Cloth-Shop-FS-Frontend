import { Card, Badge } from 'react-bootstrap';
import { FaStar, FaUser } from 'react-icons/fa';

function ReviewCard({ review }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center">
            <div 
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: '50px', height: '50px' }}
            >
              <FaUser size={24} />
            </div>
            <div>
              <h6 className="mb-0 fw-bold">{review.user_name}</h6>
              <small className="text-muted">{formatDate(review.created_at)}</small>
            </div>
          </div>
          
          <div className="star-rating">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                color={index < review.rating ? '#ffc107' : '#e0e0e0'}
                size={18}
              />
            ))}
          </div>
        </div>

        <p className="mb-0" style={{ color: '#2c3e50', lineHeight: '1.6' }}>
          {review.comment}
        </p>
      </Card.Body>
    </Card>
  );
}

export default ReviewCard;