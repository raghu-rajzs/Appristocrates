import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    FormControl,
    FormLabel,
    Heading,
    Input,
    // {Select},
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Stack,
    Text,
    VStack,
    HStack,
  } from '@chakra-ui/react';
  import { Select as ChakraSelect } from '@chakra-ui/react'; // for regular Chakra dropdowns
import ReactSelect from 'react-select';     


  import { useState } from 'react';

  
  
  const HotelForm = ({ onResult }) => {
      const [formData, setFormData] = useState({
          location: '',
          roomType: '',
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
              <ChakraSelect
                placeholder="Select room type"
                value={formData.roomType}
                onChange={(e) =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </ChakraSelect>
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
  <FormLabel>🛎️ Amenities</FormLabel>
  <ReactSelect
    isMulti
    name="amenities"
    options={[
      { value: 'wifi', label: 'Wi-Fi' },
      { value: 'pool', label: 'Pool' },
      { value: 'ac', label: 'AC' },
      { value: 'tv', label: 'TV' },
      { value: 'parking', label: 'Parking' },
      { value: 'breakfast', label: 'Breakfast' },
    ]}
    placeholder="Select amenities"
    onChange={(selectedOptions) =>
      handleChange('amenities', selectedOptions.map((opt) => opt.value))
    }
  />
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
  