import React, { useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import tw from "../../tailwind/CustomTailwind";

const LoadingImage = ({ uri }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={tw`items-center justify-center relative`}>
      <Image
        source={{ uri: uri }}
        resizeMode="center"
        style={{ width: "100%", height: 200 }}
        onLoadStart={(e) => setIsLoading(true)}
        onLoad={(e) => setIsLoading(false)}
      />
      {isLoading && (
        <View style={tw`absolute inset-0 items-center justify-center`}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}
    </View>
  );
};

export default LoadingImage;
