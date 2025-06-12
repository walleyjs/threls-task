"use client"

import type React from "react"

import { Colors } from "@/constants/Colors"
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from "react-native"
import { ThemedText } from "../ThemedText"

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
              <ThemedText style={styles.webSocialIcon}>📘</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleInstagramPress}
              style={styles.webSocialButton}
              accessibilityRole="button"
              accessibilityLabel="Visit our Instagram page"
            >
              <ThemedText style={styles.webSocialIcon}>📷</ThemedText>
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
      <View style={styles.mobileSocialSection}>
        <Pressable
          onPress={handleFacebookPress}
          style={styles.mobileSocialButton}
          accessibilityRole="button"
          accessibilityLabel="Visit our Facebook page"
        >
          <ThemedText style={styles.mobileSocialIcon}>📘</ThemedText>
        </Pressable>
        <Pressable
          onPress={handleInstagramPress}
          style={styles.mobileSocialButton}
          accessibilityRole="button"
          accessibilityLabel="Visit our Instagram page"
        >
          <ThemedText style={styles.mobileSocialIcon}>📷</ThemedText>
        </Pressable>
      </View>

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
    paddingHorizontal: 40,
    paddingVertical: 32,
    gap: 32,
  },
  webTopSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  webContactsSection: {
    gap: 12,
  },
  webContactsTitle: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "700",
  },
  webEmailButton: {
    alignSelf: "flex-start",
  },
  webEmailText: {
    color: Colors.light.background,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  webSocialSection: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  webSocialButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  webSocialIcon: {
    fontSize: 20,
  },
  webBottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 24,
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
    textDecorationLine: "underline",
  },
  webPoweredSection: {
    alignItems: "flex-end",
  },
  webPoweredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  webPoweredText: {
    color: Colors.light.background,
    fontSize: 12,
  },
  webTwineText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: "700",
  },

  mobileContainer: {
    backgroundColor: Colors.light.primary400,
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 32,
  },
  mobileSocialSection: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  mobileSocialButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileSocialIcon: {
    fontSize: 24,
  },
  mobileContactsSection: {
    gap: 12,
  },
  mobileContactsTitle: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "700",
  },
  mobileEmailButton: {
    alignSelf: "flex-start",
  },
  mobileEmailText: {
    color: Colors.light.background,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  mobileLegalSection: {
    gap: 16,
  },
  mobileLegalButton: {
    alignSelf: "flex-start",
  },
  mobileLegalText: {
    color: Colors.light.background,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  mobilePoweredSection: {
    alignItems: "center",
    marginTop: 16,
  },
  mobilePoweredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
