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
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

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
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.4;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(event.translationY * 0.6, {
          duration: 300,
        });
        runOnJS(handleSwipeRight)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(event.translationY * 0.6, {
          duration: 300,
        });
        runOnJS(handleSwipeLeft)();
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const isActive = index === activeIndex.value;
    const isBehind = index === activeIndex.value + 1;

    if (!isActive && !isBehind) {
      return { opacity: 0, transform: [{ scale: 0.9 }] };
    }

    if (isBehind) {
      const progress = interpolate(
        Math.abs(translateX.value),
        [0, SCREEN_WIDTH * 0.5],
        [0, 1]
      );
      return {
        opacity: 1,
        transform: [
          { scale: interpolate(progress, [0, 1], [0.95, 1]) },
          {
            translateY: interpolate(progress, [0, 1], [10, 0]),
          },
        ],
      };
    }

    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-20, 0, 20]
    );

    return {
      opacity: 1,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SCREEN_WIDTH * 0.2],
      [0, 1],
      "clamp"
    ),
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SCREEN_WIDTH * 0.2, 0],
      [1, 0],
      "clamp"
    ),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, cardStyle]}>
        {children}
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
