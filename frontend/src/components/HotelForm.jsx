import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import { useState } from "react";
import ReactSelect from "react-select";
import { getPricingPrediction } from '../api/pricingAPI';

const HotelForm = ({ onResult }) => {
  const [formData, setFormData] = useState({
    location: "",
    roomType: "",
    checkIn: 12,
    checkOut: 10,
    amenities: [],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await getPricingPrediction(formData);
      if (data) {
        onResult({
          ...formData,
          trends: data.trends,
          price_range: data.price_range,
        });
      }
    } catch (err) {
      console.error("API call failed:", err);
    }
  };

  return (
    <Box
      maxW="700px"
      mx="auto"
      mt={12}
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      bg={useColorModeValue("white", "gray.800")}
    >
      <Heading size="lg" mb={6} textAlign="center" color="blue.600">
        🏨 Hotel Pricing Assistant
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={5}>
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
                  borderRadius: 8,
                }),
              }}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="lg" mt={4}>
            🔍 Get Pricing Insight
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default HotelForm;
