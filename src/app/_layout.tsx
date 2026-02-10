import { ThemeProvider } from "@/components/theme-provider";
import Stack from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#111" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="match"
          options={{
            presentation: "fullScreenModal",
            animation: "fade",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
