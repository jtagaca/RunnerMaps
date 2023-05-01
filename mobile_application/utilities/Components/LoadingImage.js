import React, { useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import tw from "../../tailwind/CustomTailwind";

import { useSelector } from "react-redux";
const LoadingImage = ({ uri }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const accessibility = useSelector((state) => state.accessibility);

  const handleLoad = () => {
    setIsLoading(false);
    if (!hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  };

  return (
    <View style={tw`items-center justify-center relative`}>
      <Image
        source={{ uri: uri }}
        resizeMode="center"
        style={{ width: "100%", height: 200 }}
        onLoadStart={(e) => setIsLoading(true)}
        onLoadEnd={handleLoad}
      />
      {isLoading && !hasLoadedOnce && (
        <View style={tw`absolute inset-0 items-center justify-center`}>
          <ActivityIndicator
            size="large"
            color={accessibility.selected_background_color.secondaryColor}
          />
        </View>
      )}
    </View>
  );
};

export default LoadingImage;
