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
  Flex,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { FaHome } from "react-icons/fa";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = ({ formData, resultData, onBack }) => {
  const mockPriceData = {
    labels: resultData.trends.map((t) => t.date),
    datasets: [
      {
        label: "Avg. Price ₹",
        data: resultData.trends.map((t) => t.price),
        borderColor: "#3182ce",
        backgroundColor: "#90cdf4",
        tension: 0.4,
      },
    ],
  };

  const minPrice = resultData?.predictPrice?.predicted_price_range_in_inr?.min;
  const maxPrice = resultData?.predictPrice?.predicted_price_range_in_inr?.max;

  const demandColor =
    resultData.demand_level > 70
      ? "green.400"
      : resultData.demand_level > 50
      ? "orange.300"
      : "red.400";

  const demandText =
    resultData.demand_level > 75
      ? "very high"
      : resultData.demand_level > 50
      ? "moderate"
      : "low";

  return (
    <>
      {/* Top Heading Bar */}
      {/* Top Heading Bar */}
      <Flex
        justify="space-between"
        align="center"
        px={8}
        py={4}
        bgGradient="linear(to-r, blue.600, blue.400)"
        color="white"
        boxShadow="sm"
        position="fixed"
        top="0"
        width="100%"
        zIndex="10"
      >
        <Flex align="center" gap={3}>
          <Button
            size="sm"
            onClick={onBack}
            leftIcon={<FaHome />}
            variant="outline"
            color="white"
            borderColor="whiteAlpha.600"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            Home
          </Button>
          <Heading size="md" ml={4}>
            Hotel Pricing Assistant
          </Heading>
        </Flex>

        <Flex align="center" gap={3}>
          <Text fontSize="sm">Welcome, Aman</Text>
          <Avatar
            size="sm"
            name="Aman"
            src="https://i.pravatar.cc/150?img=32"
          />
        </Flex>
      </Flex>

      <Box
        maxW="1200px"
        mx="auto"
        mt={10}
        p={6}
        bg={useColorModeValue("gray.50", "gray.800")}
        borderRadius="xl"
        boxShadow="xl"
      >
        {/* Main Content */}
        <Box mt={20}>
          {/* Cards Section */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
            <Card
              bg={useColorModeValue("white", "gray.700")}
              boxShadow="lg"
              borderRadius="xl"
              p={5}
            >
              <CardBody>
                <Stat>
                  <StatLabel>Estimated Price Range</StatLabel>
                  <StatNumber>
                    ₹{minPrice} - ₹{maxPrice}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card
              bg={useColorModeValue("white", "gray.700")}
              boxShadow="lg"
              borderRadius="xl"
              p={5}
            >
              <CardBody>
                <Stat>
                  <StatLabel>📅 Today's Forecasted Price</StatLabel>
                  <StatNumber>₹{resultData?.predictToday?.predicted_price_range_in_inr?.max || 'N/A'}</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card
              bg={useColorModeValue("white", "gray.700")}
              boxShadow="lg"
              borderRadius="xl"
              p={5}
            >
              <CardBody textAlign="center">
                <Heading size="sm" mb={2}>
                  📊 Current Demand Level
                </Heading>
                {/* Circular Gauge Meter */}
                <Box
                  position="relative"
                  width="200px"
                  height="200px"
                  mb={4}
                  mx="auto"
                >
                  <CircularProgress
                    value={resultData.demand_level} // Value of demand level
                    size="180px" // Increase the size of the circular gauge
                    color={demandColor} // Color based on demand level
                    thickness="12px" // Increase thickness for better visibility
                    trackColor={useColorModeValue("gray.200", "gray.600")} // Light background track
                    capIsRound // Round edges for the progress bar
                  >
                    <CircularProgressLabel fontSize="xl" fontWeight="bold">
                      {demandText.toUpperCase()}{" "}
                      {/* Display demand level text */}
                    </CircularProgressLabel>
                  </CircularProgress>
                </Box>
                <Text mt={2} fontSize="lg">
                  Demand for similar {formData.roomType} rooms in{" "}
                  {formData.location} is <b>{demandText}</b>.
                </Text>
              </CardBody>
            </Card>

            <Card
              bg={useColorModeValue("white", "gray.700")}
              boxShadow="lg"
              borderRadius="xl"
              p={5}
            >
              <CardBody>
                <Flex align="center" mb={3} gap={2}>
                  <Text fontSize="2xl">💡</Text>
                  <Heading size="sm">Smart Pricing Tip</Heading>
                </Flex>
                <Box
                  bg={useColorModeValue("gray.100", "gray.600")}
                  borderRadius="md"
                  p={4}
                  border="1px solid"
                  borderColor={useColorModeValue("gray.300", "gray.500")}
                  fontStyle="italic"
                  fontSize="md"
                >
                  <Text whiteSpace="pre-line">{resultData.recommendation}</Text>
                </Box>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Price Trends Chart */}
          <Card
            bg={useColorModeValue("white", "gray.700")}
            boxShadow="lg"
            borderRadius="xl"
            p={5}
            mb={6}
          >
            <CardBody>
              <Heading size="sm" mb={4}>
                📊 Day-wise Price Trends
              </Heading>
              <Line data={mockPriceData} />
            </CardBody>
          </Card>

          <Divider my={6} />

          {/* Hotel Summary */}
          <Card
            bg={useColorModeValue("white", "gray.700")}
            boxShadow="lg"
            borderRadius="xl"
            p={5}
          >
            <CardBody>
              <Heading size="sm" mb={2}>
                🏨 Hotel Summary
              </Heading>
              <VStack align="start" spacing={1}>
                <Text>
                  <b>Location:</b> {formData.location}
                </Text>
                <Text>
                  <b>Room Type:</b> {formData.roomType}
                </Text>
                <Text>
                  <b>Check-in:</b> {formData.checkIn}:00
                </Text>
                <Text>
                  <b>Check-out:</b> {formData.checkOut}:00
                </Text>
                <Text>
                  <b>Amenities:</b> {formData.amenities.join(", ") || "None"}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Box>
      {/* Footer */}
      <Box
        as="footer"
        mt={12}
        py={6}
        bgGradient="linear(to-r, blue.600, blue.400)"
        color="white"
        textAlign="center"
        borderRadius="md"
      >
        <Text>&copy; 2025 Hotel Pricing Assistant. All Rights Reserved.</Text>
      </Box>
    </>
  );
};

export default Dashboard;
