import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated, Text, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS, DEVICE_HEIGHT , DEVICE_WIDTH  } from '../config/common';

const ANIMATED_PART_HEIGHT = 5;

const TabBar = ({ state, descriptors, navigation }:any) => {
    
    const [width, setWidth] = useState<number>(DEVICE_WIDTH)
    const [height, setHeight] = useState<number>(DEVICE_HEIGHT)
    const animationHorizontalValue = useRef(new Animated.Value(0)).current;
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    
    const [tabBarHeight, setTabBarHeight] = useState<number>(60)
    
    const animate = (index: number) => {
        Animated.spring(animationHorizontalValue, {
            toValue: index * (width / 4),
            useNativeDriver: true,
        }).start();
    };
    useEffect(() => {
        animate(state.index);

        Dimensions.addEventListener('change', (dime)=>{
            setWidth(dime.window.width)
            setHeight(dime.window.height)
        })
        
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
                            <View style={{...styles.innerView, paddingVertical: height * 0.01,}}>
                                <MaterialCommunityIcons name={icons} color={isFocused ? COLORS.WHITE : COLORS.GREY} size={18} style={{marginBottom: -2,}}/>
                                <Text numberOfLines={1} style={[styles.iconText, { color: isFocused ? COLORS.WHITE : COLORS.GREY, width: width / 4 }]}>
                                    {label}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                    );
                })}
            </View>
            <Animated.View style={{...styles.animatedWrapper, bottom: tabBarHeight/1.5,width: width / 4}}>
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
        
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
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
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -9999,

    },

});

export default TabBar;