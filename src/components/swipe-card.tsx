import { useCallback } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type SwipeCardProps = {
  children: React.ReactNode;
  index: number;
  activeIndex: SharedValue<number>;
  totalCards: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

export default function SwipeCard({
  children,
  index,
  activeIndex,
  totalCards,
  onSwipeLeft,
  onSwipeRight,
}: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleSwipeLeft = useCallback(() => {
    onSwipeLeft();
  }, [onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    onSwipeRight();
  }, [onSwipeRight]);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow gestures on the active card
      if (index === activeIndex.value) {
        translateX.value = event.translationX;
        translateY.value = event.translationY * 0.3;
      }
    })
    .onEnd((event) => {
      // Only handle end events for the active card
      if (index !== activeIndex.value) return;

      const velocity = event.velocityX;
      const translation = event.translationX;

      // Consider velocity for more responsive gestures
      const shouldSwipeRight = translation > SWIPE_THRESHOLD || velocity > 500;
      const shouldSwipeLeft = translation < -SWIPE_THRESHOLD || velocity < -500;

      if (shouldSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(event.translationY * 0.5, {
          duration: 300,
        });
        runOnJS(handleSwipeRight)();
      } else if (shouldSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(event.translationY * 0.5, {
          duration: 300,
        });
        runOnJS(handleSwipeLeft)();
      } else {
        // Spring back to center
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex.value;
    const isBehind = index === activeIndex.value + 1;

    if (!isActive && !isBehind) {
      return {
        opacity: 0,
        transform: [{ scale: 0.9 }],
        zIndex: 0,
      };
    }

    if (isBehind) {
      // Scale up the card behind based on the active card's movement
      const progress = interpolate(
        Math.abs(translateX.value),
        [0, SCREEN_WIDTH * 0.5],
        [0, 1],
        "clamp"
      );
      return {
        opacity: 1,
        transform: [
          { scale: interpolate(progress, [0, 1], [0.95, 1]) },
          { translateY: interpolate(progress, [0, 1], [10, 0]) },
        ],
        zIndex: 1,
      };
    }

    // Active card animations
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-30, 0, 30],
      "clamp"
    );

    return {
      opacity: 1,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
      zIndex: 2,
    };
  });

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SCREEN_WIDTH * 0.15],
      [0, 1],
      "clamp"
    ),
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SCREEN_WIDTH * 0.15, 0],
      [1, 0],
      "clamp"
    ),
  }));

  // Only render interactive elements for active and next card
  if (index > activeIndex.value + 1) return null;

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, cardStyle]}>
        {children}
        {index === activeIndex.value && (
          <>
            <Animated.View style={[styles.stamp, styles.likeStamp, likeOpacity]}>
              <Animated.Text style={[styles.stampText, { color: "#2ecc71" }]}>
                LIKE
              </Animated.Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.nopeStamp, nopeOpacity]}>
              <Animated.Text style={[styles.stampText, { color: "#e74c3c" }]}>
                NOPE
              </Animated.Text>
            </Animated.View>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  stamp: {
    position: "absolute",
    top: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderRadius: 10,
  },
  likeStamp: {
    left: 24,
    borderColor: "#2ecc71",
    transform: [{ rotate: "-15deg" }],
  },
  nopeStamp: {
    right: 24,
    borderColor: "#e74c3c",
    transform: [{ rotate: "15deg" }],
  },
  stampText: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 4,
  },
});
