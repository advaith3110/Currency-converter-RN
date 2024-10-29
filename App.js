import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const CurrencyConverterApp = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedCurrency, setConvertedCurrency] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  const currencies = ["USD", "INR", "EUR", "GBP", "AUD", "CAD", "JPY"];

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const rate = response.data.rates[toCurrency];
      setExchangeRate(rate);
      return rate;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return null;
    }
  };

  const handleConvert = async () => {
    if (!amount || isNaN(amount)) {
      setConvertedCurrency("Please enter a valid amount");
      return;
    }

    // Fetch exchange rate if it's not already fetched or if currencies have changed
    if (!exchangeRate) {
      const rate = await fetchExchangeRate();
      if (!rate) {
        setConvertedCurrency("Error fetching exchange rate");
        return;
      }
    }

    const convertedValue = (parseFloat(amount) * exchangeRate).toFixed(2);
    setConvertedCurrency(convertedValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter amount"
        style={styles.input}
      />

      <Text style={styles.label}>From Currency:</Text>
      <Picker
        selectedValue={fromCurrency}
        onValueChange={(itemValue) => {
          setFromCurrency(itemValue);
          setExchangeRate(null); // Reset exchange rate when changing currency
        }}
        style={styles.picker}
      >
        {currencies.map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>

      <Text style={styles.label}>To Currency:</Text>
      <Picker
        selectedValue={toCurrency}
        onValueChange={(itemValue) => {
          setToCurrency(itemValue);
          setExchangeRate(null); // Reset exchange rate when changing currency
        }}
        style={styles.picker}
      >
        {currencies.map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>

      <Button title="Convert" onPress={handleConvert} color="#007AFF" />

      {convertedCurrency && (
        <Text style={styles.result}>Converted Amount: {convertedCurrency}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    width: "80%",
    borderRadius: 5,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  picker: {
    width: "80%",
    height: 50,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  result: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 20,
  },
});

export default CurrencyConverterApp;
