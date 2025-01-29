import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        backgroundColor: "blue",
        color: "white",
        borderRadius: 2,
        transition: "0.3s",
        "&:hover": { backgroundColor: "darkblue" },
      }}
      onClick={() => navigate(`/car/${car._id}`)}
    >
      <CardActionArea>
        {/* Car Image */}
        <CardMedia
          component="img"
          height="140"
          image={car.images?.[0] || "https://via.placeholder.com/200"}
          alt={car.title}
        />

        {/* Car Details */}
        <CardContent>
          <Typography variant="h6">{car.title}</Typography>
          <Typography variant="body2">{car.description}</Typography>
          <Typography variant="caption">Tags: {car.tags.join(", ")}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CarCard;
