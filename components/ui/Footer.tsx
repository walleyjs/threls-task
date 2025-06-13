"use client"

import type React from "react"

import { Colors } from "@/constants/Colors"
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from "react-native"
import { ThemedText } from "../ThemedText"
import { FaceBookIcon } from "./FaceBook"
import { InstgaramIcon } from "./Instagram"

interface FooterProps {
  onPrivacyPress?: () => void
  onTermsPress?: () => void
  onCookiePress?: () => void
  onEmailPress?: () => void
  onFacebookPress?: () => void
  onInstagramPress?: () => void
}

export const Footer: React.FC<FooterProps> = ({
  onPrivacyPress,
  onTermsPress,
  onCookiePress,
  onEmailPress,
  onFacebookPress,
  onInstagramPress,
}) => {
  const { width } = useWindowDimensions()
  const isWeb = Platform.OS === "web"
  const isWide = isWeb && width > 768

  const handleEmailPress = () => {
    if (onEmailPress) {
      onEmailPress()
    } else if (Platform.OS === "web") {
      window.open("mailto:sales@pawlus.mt")
    }
  }

  const handleFacebookPress = () => {
    if (onFacebookPress) {
      onFacebookPress()
    } else if (Platform.OS === "web") {
      window.open("https://facebook.com", "_blank")
    }
  }

  const handleInstagramPress = () => {
    if (onInstagramPress) {
      onInstagramPress()
    } else if (Platform.OS === "web") {
      window.open("https://instagram.com", "_blank")
    }
  }

  if (isWide) {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webTopSection}>
          <View style={styles.webContactsSection}>
            <ThemedText variant="text-lg-bold" style={styles.webContactsTitle}>
              Contacts
            </ThemedText>
            <Pressable onPress={handleEmailPress} style={styles.webEmailButton}>
              <ThemedText variant="text-base-regular" style={styles.webEmailText}>
                Email: sales@pawlus.mt
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.webSocialSection}>
            <Pressable
              onPress={handleFacebookPress}
              style={styles.webSocialButton}
              accessibilityRole="button"
              accessibilityLabel="Visit our Facebook page"
            >
              <FaceBookIcon />
            </Pressable>
            <Pressable
              onPress={handleInstagramPress}
              style={styles.webSocialButton}
              accessibilityRole="button"
              accessibilityLabel="Visit our Instagram page"
            >
              <InstgaramIcon />
            </Pressable>
          </View>
        </View>

        <View style={styles.webBottomSection}>
          <View style={styles.webLegalSection}>
            <Pressable onPress={onPrivacyPress} style={styles.webLegalButton}>
              <ThemedText variant="text-sm-regular" style={styles.webLegalText}>
                Privacy Policy
              </ThemedText>
            </Pressable>
            <Pressable onPress={onTermsPress} style={styles.webLegalButton}>
              <ThemedText variant="text-sm-regular" style={styles.webLegalText}>
                Terms of Service
              </ThemedText>
            </Pressable>
            <Pressable onPress={onCookiePress} style={styles.webLegalButton}>
              <ThemedText variant="text-sm-regular" style={styles.webLegalText}>
                Cookie Policy
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.webPoweredSection}>
            <View style={styles.webPoweredBadge}>
              <ThemedText variant="text-sm-regular" style={styles.webPoweredText}>
                Powered by{" "}
              </ThemedText>
              <ThemedText variant="text-sm-bold" style={styles.webTwineText}>
                twine
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.mobileContainer}>
      <View style={styles.mobileContactsSection}>
        <ThemedText variant="text-lg-bold" style={styles.mobileContactsTitle}>
          Contacts
        </ThemedText>
        <Pressable onPress={handleEmailPress} style={styles.mobileEmailButton}>
          <ThemedText variant="text-base-regular" style={styles.mobileEmailText}>
            Email: sales@pawlus.mt
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.mobileSocialSection}>
        <Pressable
          onPress={handleFacebookPress}
          style={styles.mobileSocialButton}
          accessibilityRole="button"
          accessibilityLabel="Visit our Facebook page"
        >
          <FaceBookIcon />
        </Pressable>
        <Pressable
          onPress={handleInstagramPress}
          style={styles.mobileSocialButton}
          accessibilityRole="button"
          accessibilityLabel="Visit our Instagram page"
        >
          <InstgaramIcon />
        </Pressable>
      </View>
      <View style={styles.mobileLegalSection}>
        <Pressable onPress={onPrivacyPress} style={styles.mobileLegalButton}>
          <ThemedText variant="text-base-regular" style={styles.mobileLegalText}>
            Privacy Policy
          </ThemedText>
        </Pressable>
        <Pressable onPress={onTermsPress} style={styles.mobileLegalButton}>
          <ThemedText variant="text-base-regular" style={styles.mobileLegalText}>
            Terms of Service
          </ThemedText>
        </Pressable>
        <Pressable onPress={onCookiePress} style={styles.mobileLegalButton}>
          <ThemedText variant="text-base-regular" style={styles.mobileLegalText}>
            Cookie Policy
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.mobilePoweredSection}>
        <View style={styles.mobilePoweredBadge}>
          <ThemedText variant="text-sm-regular" style={styles.mobilePoweredText}>
            Powered by{" "}
          </ThemedText>
          <ThemedText variant="text-sm-bold" style={styles.mobileTwineText}>
            twine
          </ThemedText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  webContainer: {
    backgroundColor: Colors.light.primary400, 
    paddingHorizontal: 64,
    paddingVertical: 40,
    paddingTop:100
  },
  webTopSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 80,
  },
  webContactsSection: {
    gap: 8,
  },
  webContactsTitle: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "600",
  },
  webEmailButton: {
    alignSelf: "flex-start",
  },
  webEmailText: {
    color: Colors.light.background,
    fontSize: 16,
    textDecorationLine: "none",
  },
  webSocialSection: {
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
  },
  webSocialButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  webBottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20, 
    borderTopWidth: 1,
    borderTopColor: "#334AAD",
   
  },
  webLegalSection: {
    flexDirection: "row",
    gap: 24,
  },
  webLegalButton: {
    alignSelf: "flex-start",
  },
  webLegalText: {
    color: Colors.light.background,
    fontSize: 14,
    textDecorationLine: "none", 
  },
  webPoweredSection: {
    alignItems: "flex-end",
  },
  webPoweredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  webPoweredText: {
    color: Colors.light.background,
    fontSize: 14,
  },
  webTwineText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: "700",
  },

  mobileContainer: {
    backgroundColor: "#2A3990", 
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  mobileContactsSection: {
    marginBottom: 24,
    gap: 8,
  },
  mobileContactsTitle: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "600",
  },
  mobileEmailButton: {
    alignSelf: "flex-start",
  },
  mobileEmailText: {
    color: Colors.light.background,
    fontSize: 16,
    textDecorationLine: "none", 
  },
  mobileSocialSection: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 32,
    alignSelf: "flex-end",
  },
  mobileSocialButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileLegalSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  mobileLegalButton: {
    alignSelf: "flex-start",
  },
  mobileLegalText: {
    color: Colors.light.background,
    fontSize: 14,
    textDecorationLine: "none",
  },
  mobilePoweredSection: {
    alignItems: "flex-end",
  },
  mobilePoweredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  mobilePoweredText: {
    color: Colors.light.background,
    fontSize: 14,
  },
  mobileTwineText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: "700",
  },
})
