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
  } from '@chakra-ui/react';
  import { Line } from 'react-chartjs-2';
  import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
  
  ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);
  
  const Dashboard = ({ formData, resultData }) => {
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
  
    const recommendation = `Based on demand in ${formData.location}, consider adjusting prices as shown in the trend below.`;
  
    const minPrice = Math.min(...resultData.trends.map((t) => t.price));
    const maxPrice = Math.max(...resultData.trends.map((t) => t.price));
  
  
    return (
      <Box maxW="900px" mx="auto" mt={10} p={6}>
        <Heading size="lg" mb={4}>📈 Pricing Dashboard</Heading>
  
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Estimated Price Range</StatLabel>
                <StatNumber>₹{minPrice} - ₹{maxPrice}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
  
          <Card>
            <CardBody>
              <Heading size="sm" mb={2}>Smart Pricing Tip</Heading>
              <Text>{recommendation}</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
  
        <Card>
          <CardBody>
            <Heading size="sm" mb={4}>Day-wise Price Trends</Heading>
            <Line data={mockPriceData} />
          </CardBody>
        </Card>
  
        <Divider my={6} />
  
        <Card>
          <CardBody>
            <Heading size="sm" mb={2}>Hotel Summary</Heading>
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
  