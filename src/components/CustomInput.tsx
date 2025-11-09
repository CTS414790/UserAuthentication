import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
}

const CustomInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  error,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: { flex: 1, height: 40 },
  error: { color: "red", marginTop: 5 },
});

export default CustomInput;
