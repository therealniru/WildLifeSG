import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  color: string;
  icon: number;
}

const ActionButton = ({ title, onPress, color, icon }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        tw`flex-row py-4 rounded-lg items-center shadow-md mb-2`, // Tailwind classes for padding, border radius, alignment, shadow
        { backgroundColor: color },
      ]}
      onPress={onPress}
      
    >
      <Image source = {icon} style = {tw`w-8 h-8 ml-4`} resizeMode="contain"/>
      <Text style={tw`text-green-800 text-base font-semibold ml-8`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
