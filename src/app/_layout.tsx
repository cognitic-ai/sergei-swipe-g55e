import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast";
import Stack from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <ThemeProvider>
      <ToastProvider>
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
      </ToastProvider>
    </ThemeProvider>
  );
}
