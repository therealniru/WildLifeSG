import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  color: string;
}

const ActionButton = ({ title, onPress, color }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        tw`py-4 rounded-lg items-center shadow-md mb-2`, // Tailwind classes for padding, border radius, alignment, shadow
        { backgroundColor: color },
      ]}
      onPress={onPress}
    >
      <Text style={tw`text-white text-base font-semibold`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
