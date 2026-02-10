import SwipeCard from "@/components/swipe-card";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { toast } from "@/components/toast";

const BASE_URL = "https://sergei.love";

const PROFILES = [
  {
    id: "1",
    name: "Sergei",
    age: 28,
    bio: "Software engineer by day, adventurer by night. Looking for someone to debug life with me.",
    distance: "2 miles away",
    image: `${BASE_URL}/assets/images/profile-suit-smile-5.jpg`,
    tags: ["Tech", "Travel", "Adventure"],
  },
  {
    id: "2",
    name: "Sergei",
    age: 28,
    bio: "Pool day is every day when you have the right attitude. Certified vibe curator.",
    distance: "2 miles away",
    image: `${BASE_URL}/assets/images/profile-pool-1.JPG`,
    tags: ["Swimming", "Vibes", "Chill"],
  },
  {
    id: "3",
    name: "Sergei",
    age: 28,
    bio: "Beach bum with a business plan. Let's build sandcastles and empires together.",
    distance: "2 miles away",
    image: `${BASE_URL}/assets/images/profile-beach-2.JPG`,
    tags: ["Beach", "Entrepreneur", "Sunsets"],
  },
  {
    id: "4",
    name: "Sergei",
    age: 28,
    bio: "Burning Man survivor. I've seen things you wouldn't believe. Let's create our own adventure.",
    distance: "2 miles away",
    image: `${BASE_URL}/assets/images/profile-burning-man-3.JPG`,
    tags: ["Burning Man", "Festivals", "Art"],
  },
  {
    id: "5",
    name: "Sergei",
    age: 28,
    bio: "Gondola rides and good vibes. I believe in la dolce vita and finding magic in everyday moments.",
    distance: "2 miles away",
    image: `${BASE_URL}/assets/images/profile-gondola-4.jpg`,
    tags: ["Venice", "Romance", "Travel"],
  },
  {
    id: "6",
    name: "Sergei",
    age: 28,
    bio: "From Russia with love. World traveler, culture enthusiast, and your next favorite person.",
    distance: "2 miles away",
    image: `${BASE_URL}/assets/images/profile-russia-6.JPG`,
    tags: ["Russia", "Culture", "Worldly"],
  },
  {
    id: "7",
    name: "Sergei",
    age: 28,
    bio: "Hot tub philosopher. Life's too short for lukewarm everything. Swipe right, I dare you.",
    distance: "2 miles away",
    image: `${BASE_URL}/assets/images/profile-hot-tub-7.jpg`,
    tags: ["Relaxation", "Fun", "Bold"],
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function TinderScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeIndex = useSharedValue(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(width - 20, 440);

  const handleSwipeLeft = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    toast({
      title: "Something went wrong",
      message: "An unexpected error occurred. Please try again.",
      preset: "error",
      haptic: "error",
    });
    // Reset to same card after a brief delay
    setTimeout(() => {
      activeIndex.value = currentIndex;
    }, 400);
  }, [currentIndex, activeIndex]);

  const handleSwipeRight = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (currentIndex < PROFILES.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      activeIndex.value = next;
    } else {
      router.push("/match");
    }
  }, [currentIndex, activeIndex, router]);

  const handleNope = useCallback(() => {
    handleSwipeLeft();
  }, [handleSwipeLeft]);

  const handleLike = useCallback(() => {
    handleSwipeRight();
  }, [handleSwipeRight]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#111" }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            gap: 6,
          }}
        >
          <Image
            source="sf:flame.fill"
            style={{ width: 28, height: 28, tintColor: "#FE3C72" }}
          />
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: "#FE3C72",
              letterSpacing: 1,
            }}
          >
            tinder
          </Text>
        </View>

        {/* Card Area */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: cardWidth,
              aspectRatio: 0.65,
              maxHeight: "85%",
            }}
          >
            {PROFILES.map((profile, index) => {
              if (index < currentIndex || index > currentIndex + 1) return null;
              return (
                <SwipeCard
                  key={`${profile.id}-${currentIndex}`}
                  index={index}
                  activeIndex={activeIndex}
                  totalCards={PROFILES.length}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                >
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 16,
                      borderCurve: "continuous",
                      overflow: "hidden",
                      backgroundColor: "#222",
                    }}
                  >
                    <Image
                      source={profile.image}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={200}
                    />
                    <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(0,0,0,0.15)",
                        "rgba(0,0,0,0.8)",
                      ]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "55%",
                        justifyContent: "flex-end",
                        padding: 20,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                          gap: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 32,
                            fontWeight: "800",
                          }}
                        >
                          {profile.name}
                        </Text>
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 26,
                            fontWeight: "400",
                            marginBottom: 2,
                          }}
                        >
                          {profile.age}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 4,
                        }}
                      >
                        <Ionicons name="location-sharp" size={14} color="#ddd" />
                        <Text
                          style={{
                            color: "#ddd",
                            fontSize: 14,
                          }}
                        >
                          {profile.distance}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: "#eee",
                          fontSize: 15,
                          marginTop: 10,
                          lineHeight: 20,
                        }}
                      >
                        {profile.bio}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 8,
                          marginTop: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        {profile.tags.map((tag) => (
                          <View
                            key={tag}
                            style={{
                              borderWidth: 1,
                              borderColor: "rgba(255,255,255,0.5)",
                              borderRadius: 20,
                              paddingHorizontal: 12,
                              paddingVertical: 4,
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: "500",
                              }}
                            >
                              {tag}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </LinearGradient>
                  </View>
                </SwipeCard>
              );
            })}
          </View>
        </View>

        {/* Bottom Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            paddingBottom: insets.bottom + 16,
            paddingTop: 8,
          }}
        >
          <Pressable
            onPress={handleNope}
            style={({ pressed }) => ({
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 2,
              borderColor: "#e74c3c",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
          >
            <Ionicons name="close" size={32} color="#e74c3c" />
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toast({
                title: "Super Like!",
                message: "Sergei noticed you!",
                preset: "done",
                haptic: "success",
              });
            }}
            style={({ pressed }) => ({
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 2,
              borderColor: "#3498db",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
          >
            <Ionicons name="star" size={26} color="#3498db" />
          </Pressable>

          <Pressable
            onPress={handleLike}
            style={({ pressed }) => ({
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 2,
              borderColor: "#2ecc71",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
          >
            <Ionicons name="heart" size={32} color="#2ecc71" />
          </Pressable>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
