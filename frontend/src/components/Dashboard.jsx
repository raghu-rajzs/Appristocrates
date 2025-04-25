import {
    Box,
    Heading,
    Text,
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
  
  const Dashboard = ({ formData }) => {
    const mockPriceData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Avg. Price ₹',
          data: [2000, 2100, 2150, 2200, 2500, 2800, 2600],
          borderColor: '#3182ce',
          backgroundColor: '#90cdf4',
          tension: 0.4,
        },
      ],
    };
  
    const mockRecommendation = `Based on current demand in ${formData.location || 'your area'}, consider increasing your room rates by 8% on weekends.`;
  
    const minPrice = Math.min(...mockPriceData.datasets[0].data);
    const maxPrice = Math.max(...mockPriceData.datasets[0].data);
  
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
              <Text>{mockRecommendation}</Text>
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
  