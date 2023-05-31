import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated, Text, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS, DEVICE_HEIGHT as height, DEVICE_WIDTH as width } from '../config/common';

const ANIMATED_PART_HEIGHT = 5;
const TAB_BAR_WIDTH = width / 4;

const TabBar = ({ state, descriptors, navigation }:any) => {
    
    const animationHorizontalValue = useRef(new Animated.Value(0)).current;
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    const [tabBarHeight, setTabBarHeight] = useState<number>(60)
    const animate = (index: number) => {
        Animated.spring(animationHorizontalValue, {
            toValue: index * TAB_BAR_WIDTH,
            useNativeDriver: true,
        }).start();
    };
    useEffect(() => {
        animate(state.index);
        
    }, [state.index]);

    const onLayout = (e: any) => {
        console.log(e.nativeEvent.layout.height);
        setTabBarHeight(e.nativeEvent.layout.height)
    }
    return (
        <View style={{...styles.container, display: focusedOptions?.tabBarStyle?.display? focusedOptions?.tabBarStyle?.display: 'flex'}} onLayout={onLayout}>
            <View style={{ flexDirection: 'row' }}>
                {state.routes.map((route:any, index:any, number:any) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel || route.name;
                    const icons = options.title
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableWithoutFeedback
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabButton}
                            key={`${index}--${route.key}`}
                        >
                            <View style={styles.innerView}>
                                <MaterialCommunityIcons name={icons} color={isFocused ? COLORS.WHITE : COLORS.GREY} size={18} style={{marginBottom: -2,}}/>
                                <Text numberOfLines={1} style={[styles.iconText, { color: isFocused ? COLORS.WHITE : COLORS.GREY }]}>
                                    {label}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                    );
                })}
            </View>
            <Animated.View style={{...styles.animatedWrapper, bottom: tabBarHeight/1.5,}}>
                <Animated.View
                    style={[
                        styles.animatedView,
                        {
                            transform: [{ translateX: animationHorizontalValue }],
                        },
                    ]}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderTopColor: COLORS.MAIN,
        borderTopWidth: 0.5,
        backgroundColor: COLORS.MAIN,
    },
    tabButton: {
        flex: 1,
        zIndex: 999999,
    },
    innerView: {
        paddingVertical: height * 0.01,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        width: TAB_BAR_WIDTH,
        textAlign: 'center',
        marginTop: 5
    },
    animatedView: {
        width: 40,
        height: 23,
        backgroundColor: COLORS.GREY,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: -9999,
        borderRadius: 50,
        bottom: -10
    },
    animatedWrapper: {
        width: TAB_BAR_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -9999,

    },

});

export default TabBar;