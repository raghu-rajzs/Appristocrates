import {
  Box,
  Heading,
  Text,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Card,
  CardBody,
  Divider,
  VStack,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = ({ formData, resultData, onBack }) => {
  const mockPriceData = {
    labels: resultData.trends.map((t) => t.date),
    datasets: [
      {
        label: 'Avg. Price ₹',
        data: resultData.trends.map((t) => t.price),
        borderColor: '#3182ce',
        backgroundColor: '#90cdf4',
        tension: 0.4,
      },
    ],
  };

  const minPrice = Math.min(...resultData.trends.map((t) => t.price));
  const maxPrice = Math.max(...resultData.trends.map((t) => t.price));

  const demandColor =
    resultData.demand_level > 70
      ? 'green.400'
      : resultData.demand_level > 50
      ? 'orange.300'
      : 'red.400';

  const demandText =
    resultData.demand_level > 75
      ? 'very high'
      : resultData.demand_level > 50
      ? 'moderate'
      : 'low';

  return (
    <Box maxW="900px" mx="auto" mt={10} p={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">📈 Pricing Dashboard</Heading>
        <Button colorScheme="gray" variant="outline" onClick={onBack}>
          🏠 Home
        </Button>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Estimated Price Range</StatLabel>
              <StatNumber>
                ₹{minPrice} - ₹{maxPrice}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>📅 Today's Forecasted Price</StatLabel>
              <StatNumber>₹{resultData.forecast_price}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody textAlign="center">
            <Heading size="sm" mb={2}>📊 Current Demand Level</Heading>
            <CircularProgress
              value={resultData.demand_level}
              size="120px"
              color={demandColor}
            >
              <CircularProgressLabel>{resultData.demand_level}%</CircularProgressLabel>
            </CircularProgress>
            <Text mt={2}>
              Demand for similar {formData.roomType} rooms in {formData.location} is <b>{demandText}</b>.
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="sm" mb={2}>💡 Smart Pricing Tip</Heading>
            <Text>{resultData.recommendation}</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="sm" mb={4}>📊 Day-wise Price Trends</Heading>
          <Line data={mockPriceData} />
        </CardBody>
      </Card>

      <Divider my={6} />

      <Card>
        <CardBody>
          <Heading size="sm" mb={2}>🏨 Hotel Summary</Heading>
          <VStack align="start" spacing={1}>
            <Text><b>Location:</b> {formData.location}</Text>
            <Text><b>Room Type:</b> {formData.roomType}</Text>
            <Text><b>Check-in:</b> {formData.checkIn}:00</Text>
            <Text><b>Check-out:</b> {formData.checkOut}:00</Text>
            <Text><b>Amenities:</b> {formData.amenities.join(', ') || 'None'}</Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Dashboard;
