import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TimeRangeSelector = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState([]);
  const [excludedTime, setExcludedTime] = useState([]);
  const [tempRange, setTempRange] = useState([]);
  const [tempExcludeRange, setTempExcludeRange] = useState([]);

  // Handle hour block selection
  const handleHourSelection = (hour) => {
    if (tempRange.length === 0) {
      setTempRange([hour]);
    } else if (tempRange.length === 1) {
      const startHour = parseInt(tempRange[0]);
      const endHour = parseInt(hour);
      if (startHour <= endHour) {
        const newRange = Array.from(
          { length: endHour - startHour + 1 },
          (_, i) => (startHour + i).toString()
        );
        if (!selectedTimeRange.flat().includes(hour)) {
          setSelectedTimeRange((prev) => [...prev, newRange]);
        }
      } else {
        if (!selectedTimeRange.flat().includes(hour)) {
          setSelectedTimeRange((prev) => [...prev, [hour]]);
        }
      }
      setTempRange([]);
    }
  };

  // Handle excluded hours
  const handleExclude = (hour) => {
    if (tempExcludeRange.length === 0) {
      setTempExcludeRange([hour]);
    } else if (tempExcludeRange.length === 1) {
      const startHour = parseInt(tempExcludeRange[0]);
      const endHour = parseInt(hour);
      if (startHour <= endHour) {
        const newExcludeRange = Array.from(
          { length: endHour - startHour + 1 },
          (_, i) => (startHour + i).toString()
        );
        if (!excludedTime.includes(hour)) {
          setExcludedTime((prev) => [...prev, ...newExcludeRange]);
        }
      } else {
        if (!excludedTime.includes(hour)) {
          setExcludedTime((prev) => [...prev, hour]);
        }
      }
      setTempExcludeRange([]);
    }
  };

  // Convert selected time range to the desired format
  const formatSelectedTimeRange = () => {
    return selectedTimeRange.map((range) => {
      if (range.length === 1) {
        return range[0];
      } else {
        return `${range[0]}-${range[range.length - 1]}`;
      }
    });
  };

  // Convert excluded time to the desired format
  const formatExcludedTime = () => {
    const formatted = [];
    let temp = [];
    for (let i = 0; i < excludedTime.length; i++) {
      const current = parseInt(excludedTime[i]);
      const next =
        i < excludedTime.length - 1 ? parseInt(excludedTime[i + 1]) : null;

      if (temp.length === 0) {
        temp.push(current);
      }

      if (next !== current + 1) {
        if (temp.length === 1) {
          formatted.push(`${temp[0]}`);
        } else {
          formatted.push(`${temp[0]}-${temp[temp.length - 1]}`);
        }
        temp = [];
      } else {
        temp.push(next);
      }
    }
    return formatted;
  };

  // Log selected and excluded time slots
  console.log("Selected Time Range:", formatSelectedTimeRange());
  console.log("Excluded Time:", formatExcludedTime());

  // Render hour blocks
  const renderHourBlocks = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString());
    return hours.map((hour) => (
      <TouchableOpacity
        key={hour}
        style={[
          styles.hourBlock,
          {
            backgroundColor: excludedTime.includes(hour)
              ? "#ecf0f1"
              : selectedTimeRange.flat().includes(hour)
              ? "#3498db"
              : "#ecf0f1",
            borderColor: excludedTime.includes(hour) ? "#e74c3c" : "#bdc3c7",
          },
        ]}
        onPress={() => handleHourSelection(hour)}
        onLongPress={() => handleExclude(hour)}>
        <Text style={styles.hourText}>{hour}</Text>
      </TouchableOpacity>
    ));
  };

  return <View style={styles.container}>{renderHourBlocks()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  hourBlock: {
    width: "12.5%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    margin: 2,
  },
  hourText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TimeRangeSelector;
