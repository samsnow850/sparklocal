import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];
const CONFETTI_COUNT = 50;

interface ConfettiProps {
  color: string;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  size: number;
}

const Confetti: React.FC<ConfettiProps> = ({ color, x, y, rotation, size }) => {
  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: color,
          width: size,
          height: size * 0.4,
          transform: [
            { translateX: x },
            { translateY: y },
            { rotate: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }
          ]
        }
      ]}
    />
  );
};

const ConfettiCannon: React.FC = () => {
  const [confetti, setConfetti] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const confettiPieces = [];
    
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const x = new Animated.Value(Math.random() * width * 0.8);
      const y = new Animated.Value(-20);
      const rotation = new Animated.Value(0);
      const size = Math.random() * 10 + 5;
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      
      const xAnimation = Animated.timing(x, {
        toValue: Math.random() * width,
        duration: Math.random() * 2000 + 2000,
        useNativeDriver: true,
        easing: Easing.linear
      });
      
      const yAnimation = Animated.timing(y, {
        toValue: height,
        duration: Math.random() * 2000 + 2000,
        useNativeDriver: true,
        easing: Easing.linear
      });
      
      const rotationAnimation = Animated.timing(rotation, {
        toValue: 1,
        duration: Math.random() * 2000 + 2000,
        useNativeDriver: true,
        easing: Easing.linear
      });
      
      confettiPieces.push(
        <Confetti 
          key={i} 
          color={color} 
          x={x} 
          y={y} 
          rotation={rotation} 
          size={size} 
        />
      );
      
      Animated.parallel([xAnimation, yAnimation, rotationAnimation]).start();
    }
    
    setConfetti(confettiPieces);
  }, []);
  
  return (
    <View style={styles.container}>
      {confetti}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
});

export default ConfettiCannon;
