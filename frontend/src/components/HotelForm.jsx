import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Stack,
    Text,
    VStack,
    HStack,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  
  const HotelForm = ({ onResult }) => {
    const [formData, setFormData] = useState({
      location: '',
      roomType: '',
      checkIn: 12,
      checkOut: 10,
      amenities: [],
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onResult(formData);
    };
  
    return (
      <Box maxW="600px" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
        <Heading size="lg" mb={6} textAlign="center">
          Hotel Pricing Assistant
        </Heading>
  
        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="e.g. Jaipur"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </FormControl>
  
            <FormControl isRequired>
              <FormLabel>Room Type</FormLabel>
              <Select
                placeholder="Select room type"
                value={formData.roomType}
                onChange={(e) =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </Select>
            </FormControl>
  
            <FormControl>
              <FormLabel>Check-In Time: {formData.checkIn}:00</FormLabel>
              <Slider
                min={0}
                max={23}
                step={1}
                value={formData.checkIn}
                onChange={(val) =>
                  setFormData({ ...formData, checkIn: val })
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
  
            <FormControl>
              <FormLabel>Check-Out Time: {formData.checkOut}:00</FormLabel>
              <Slider
                min={0}
                max={23}
                step={1}
                value={formData.checkOut}
                onChange={(val) =>
                  setFormData({ ...formData, checkOut: val })
                }
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
  
            <FormControl>
              <FormLabel>Hotel Amenities</FormLabel>
              <CheckboxGroup
                value={formData.amenities}
                onChange={(vals) =>
                  setFormData({ ...formData, amenities: vals })
                }
              >
                <HStack spacing={4} wrap="wrap">
                  {['WiFi', 'AC', 'Pool', 'Parking', 'Breakfast'].map((a) => (
                    <Checkbox key={a} value={a}>
                      {a}
                    </Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
            </FormControl>
  
            <Button type="submit" colorScheme="blue" size="lg">
              Get Pricing Insight
            </Button>
          </Stack>
        </form>
      </Box>
    );
  };
  
  export default HotelForm;
  