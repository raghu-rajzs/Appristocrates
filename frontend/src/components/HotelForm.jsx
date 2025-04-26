import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select as ChakraSelect,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stack,
  useColorModeValue,
  Text,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import ReactSelect from "react-select";
import { getPricingPrediction } from "../api/pricingAPI";
import { FaCheckCircle } from "react-icons/fa";

const HotelForm = ({ onResult }) => {
  const [formData, setFormData] = useState({
    hotelName: "",
    location: "",
    roomType: "",
    checkIn: 12,
    checkOut: 10,
    amenities: [],
    distanceFromCityCenter: 0, // New field for distance
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await getPricingPrediction(formData);
      if (data) {
        onResult({
          ...formData,
          trends: data.trends,
          price_range: data.price_range,
          forecast_price: data.forecast_price,
          demand_level: data.demand_level,
          recommendation: data.recommendation,
        });
      }
    } catch (err) {
      console.error("API call failed:", err);
    }
  };

  return (
    <>
      {/* Top Nav */}
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
        <Heading size="md">Hotel Pricing Assistant</Heading>
        <Flex align="center" gap={3}>
          <Text fontSize="sm">Welcome, Aman</Text>
          <Avatar
            size="sm"
            name="Aman"
            src="https://i.pravatar.cc/150?img=32"
          />
        </Flex>
      </Flex>

      {/* Hero Section */}
      <Box
        h="70vh"
        bgGradient="linear(to-b, blue.50, white)"
        pt="80px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        textAlign="center"
        gap="16px"
        px={6}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Heading
          size="2xl"
          bgClip="text"
          lineHeight="3em"
          bgGradient="linear(to-r, teal.400, blue.600)"
        >
          Powering Hotel Pricing with AI 🚀
        </Heading>
        <Text mt={4} fontSize="xl" color="gray.600" maxW="600px">
          Analyze real-time demand, forecast trends, and get smart pricing
          suggestions—all in one place.
        </Text>
        <Text mt={10} fontSize="lg" color="gray.500">
          Scroll to get started 👇
        </Text>
      </Box>

      {/* Objectives Section */}
      <Box
        bg="gray.50"
        py={16}
        px={8}
        minH="50vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading size="lg" mb={12} color="blue.600" textAlign="center">
          Our Objectives
        </Heading>

        <Flex
          direction={{ base: "column", md: "row" }}
          gap={8}
          maxW="1000px"
          w="100%"
          justify="space-between"
          align="start"
        >
          <Box
            flex="1"
            px={4}
            borderRight={{ base: "none", md: "1px solid #CBD5E0" }}
          >
            <Flex align="center" gap={3} mb={3}>
              <Icon as={FaCheckCircle} color="green.400" boxSize={5} />
              <Heading size="md">Smart Dynamic Pricing</Heading>
            </Flex>
            <Text color="gray.600">
              Get AI-driven price suggestions using market trends, past
              bookings, and competitor data to optimize rates.
            </Text>
          </Box>

          <Box
            flex="1"
            px={4}
            borderRight={{ base: "none", md: "1px solid #CBD5E0" }}
          >
            <Flex align="center" gap={3} mb={3}>
              <Icon as={FaCheckCircle} color="green.400" boxSize={5} />
              <Heading size="md">Maximize Revenue</Heading>
            </Flex>
            <Text color="gray.600">
              Adjust prices dynamically to capture demand and increase
              occupancy, even during off-peak periods.
            </Text>
          </Box>

          <Box flex="1" px={4}>
            <Flex align="center" gap={3} mb={3}>
              <Icon as={FaCheckCircle} color="green.400" boxSize={5} />
              <Heading size="md">Simplify Decision-Making</Heading>
            </Flex>
            <Text color="gray.600">
              Eliminate manual guesswork—our assistant provides actionable
              insights you can trust instantly.
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Form Section */}
      <Box bg="gray.50" py={16} px={4}>
        <Text fontSize="xl" color="gray.700" textAlign="center" mb={6}>
          Please share your hotel room details below to help us optimize your
          room prices and maximize your revenue.
        </Text>

        <Box
          display="flex"
          justifyContent="center"
          flexDir="column"
          maxW="700px"
          mx="auto"
          mt={6}
          p={{ base: 6, md: 10 }}
          borderRadius="2xl"
          boxShadow="2xl"
          bg={useColorModeValue("whiteAlpha.900", "gray.700")}
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.600")}
        >
          <Heading size="md" mb={6} textAlign="center" color="blue.600">
            🔍 Enter Hotel Details
          </Heading>

          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              {/* Form Fields (no changes here) */}
              <FormControl isRequired>
                <FormLabel>🏨 Hotel Name</FormLabel>
                <Input
                  placeholder="e.g. The Grand Hotel"
                  value={formData.hotelName}
                  onChange={(e) => handleChange("hotelName", e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>📍 Location</FormLabel>
                <Input
                  placeholder="e.g. Jaipur"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>🛏️ Room Type</FormLabel>
                <ChakraSelect
                  placeholder="Select room type"
                  value={formData.roomType}
                  onChange={(e) => handleChange("roomType", e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </ChakraSelect>
              </FormControl>

              <FormControl>
                <FormLabel>
                  📍 Distance from City Center:{" "}
                  {formData.distanceFromCityCenter} km
                </FormLabel>
                <Slider
                  min={0}
                  max={15}
                  step={0.1}
                  value={formData.distanceFromCityCenter}
                  onChange={(val) =>
                    handleChange("distanceFromCityCenter", val)
                  }
                >
                  <SliderTrack>
                    <SliderFilledTrack bg="teal.400" />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </FormControl>

              <FormControl>
                <FormLabel>🕓 Check-In Time: {formData.checkIn}:00</FormLabel>
                <Slider
                  min={0}
                  max={23}
                  step={1}
                  value={formData.checkIn}
                  onChange={(val) => handleChange("checkIn", val)}
                >
                  <SliderTrack>
                    <SliderFilledTrack bg="teal.400" />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </FormControl>

              <FormControl>
                <FormLabel>🕚 Check-Out Time: {formData.checkOut}:00</FormLabel>
                <Slider
                  min={0}
                  max={23}
                  step={1}
                  value={formData.checkOut}
                  onChange={(val) => handleChange("checkOut", val)}
                >
                  <SliderTrack>
                    <SliderFilledTrack bg="red.400" />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </FormControl>

              <FormControl>
                <FormLabel>🛎️ Amenities</FormLabel>
                <ReactSelect
                  isMulti
                  name="amenities"
                  options={[
                    { value: "wifi", label: "Wi-Fi" },
                    { value: "pool", label: "Pool" },
                    { value: "ac", label: "AC" },
                    { value: "tv", label: "TV" },
                    { value: "parking", label: "Parking" },
                    { value: "breakfast", label: "Breakfast" },
                  ]}
                  placeholder="Select amenities"
                  onChange={(selectedOptions) =>
                    handleChange(
                      "amenities",
                      selectedOptions.map((opt) => opt.value)
                    )
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#CBD5E0",
                      borderRadius: 10,
                      padding: 2,
                    }),
                  }}
                />
              </FormControl>

              <Button
                type="submit"
                size="lg"
                colorScheme="blue"
                mt={4}
                bgGradient="linear(to-r, blue.400, blue.600)"
                _hover={{ bgGradient: "linear(to-r, blue.500, blue.700)" }}
                borderRadius="lg"
                shadow="md"
              >
                🔍 Get Pricing Insight
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        mt={20}
        py={6}
        px={8}
        bg="blue.600"
        color="white"
        textAlign="center"
      >
        <Text fontSize="sm">
          © {new Date().getFullYear()} Hotel Pricing Assistant. Built with ❤️
          during the Hackathon.
        </Text>
      </Box>
    </>
  );
};

export default HotelForm;
