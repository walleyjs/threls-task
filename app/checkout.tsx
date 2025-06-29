import { useCart } from "@/components/CartContext"
import { ThemedText } from "@/components/ThemedText"
import { Footer } from "@/components/ui/Footer"
import { Header } from "@/components/ui/Header"
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { ShipIcon } from "@/components/ui/ShipIcon"
import { StoreIcon } from "@/components/ui/StoreIcon"
import { Colors } from "@/constants/Colors"
import { type Country, europeanCountries, type State } from "@/constants/countries"
import { useRouter } from "expo-router"
import { Suspense, useState } from "react"
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native"

interface FormState {
  firstName: string
  lastName: string
  company: string
  vat: string
  phone: string
  country: string
  state: string
  address1: string
  address2: string
  city: string
  zip: string
  delivery: string
  shipToDifferent: boolean
}

export default function CheckoutScreen() {
  const { state, dispatch } = useCart()
  const items = state.items
  const { width } = useWindowDimensions()
  const isWide = width >= 900
  const router = useRouter()
  

  const subtotal = items.reduce((sum, item) => sum + item.variant.price.amount * item.quantity, 0)
  const shipping = items.length ? 2.5 : 0
  const tax = items.length ? 0.5 : 0
  const total = subtotal + shipping + tax

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    company: "",
    vat: "",
    phone: "",
    country: "MT",
    state: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
    delivery: "ship",
    shipToDifferent: false,
  })

  const [showCountryModal, setShowCountryModal] = useState(false)
  const [showStateModal, setShowStateModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const selectedCountry = europeanCountries.find((c) => c.code === form.country)
  const availableStates = selectedCountry?.states || []

  const handleChange = (key: keyof FormState, value: string | boolean) => {
    if (key === "country") {
      setForm((f) => ({ ...f, [key]: value as string, state: "" }))
    } else {
      setForm((f) => ({ ...f, [key]: value }))
    }
  }

  const handleCountrySelect = (country: Country) => {
    handleChange("country", country.code)
    setShowCountryModal(false)
  }

  const handleStateSelect = (state: State) => {
    handleChange("state", state.code)
    setShowStateModal(false)
  }

  const getCountryName = (code: string) => {
    return europeanCountries.find((c) => c.code === code)?.name || ""
  }

  const getStateName = (code: string) => {
    return availableStates.find((s) => s.code === code)?.name || ""
  }

  const isFormValid = () => {
    const requiredFields = ["firstName", "lastName", "phone", "address1", "city", "zip"]
    const hasRequiredFields = requiredFields.every((field) => {
      const value = form[field as keyof typeof form]
      return typeof value === "string" && value.trim() !== ""
    })
    return hasRequiredFields && items.length > 0
  }

  const handlePayNow = () => {
    if (!isFormValid()) return

    const newOrderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setOrderNumber(newOrderNumber)
    setShowSuccessModal(true)
  }

  const handleContinueShopping = () => {
    handleCloseSuccessModal()
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    dispatch({ type: "CLEAR_CART" })
    router.push("/")
  }

  const SummarySection = () => (
    <View style={[styles.summaryCard, isWide ? styles.summaryCardWide : styles.summaryCardMobile]}>
      <View style={styles.summaryContent}>
        <View style={styles.summaryRow}>
          <ThemedText variant="text-sm-medium" style={styles.summaryLabel}>
            Subtotal
          </ThemedText>
          <ThemedText variant="text-sm-medium" style={styles.summaryValue}>
            €{subtotal.toFixed(2)}
          </ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText variant="text-sm-medium" style={styles.summaryLabel}>
            Shipping estimate
          </ThemedText>
          <ThemedText variant="text-sm-medium" style={styles.summaryValue}>
            €{shipping.toFixed(2)}
          </ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText variant="text-sm-medium" style={styles.summaryLabel}>
            Tax estimate
          </ThemedText>
          <ThemedText variant="text-sm-medium" style={styles.summaryValue}>
            €{tax.toFixed(2)}
          </ThemedText>
        </View>
        <View style={[styles.summaryRow, styles.summaryRowTotal]}>
          <ThemedText variant="text-sm-medium" style={styles.summaryTotalLabel}>
            Total
          </ThemedText>
          <ThemedText variant="text-sm-medium" style={styles.summaryTotalValue}>
            €{total.toFixed(2)}
          </ThemedText>
        </View>
      </View>
    </View>
  )

  const SuccessModal = () => (
    <Modal visible={showSuccessModal} transparent={true} animationType="fade" onRequestClose={handleCloseSuccessModal}>
      <View style={styles.successModalOverlay}>
        <View style={[styles.successModalContent, isWide && styles.successModalContentWide]}>
          <View style={styles.successIconContainer}>
            <View style={styles.successIcon}>
              <ThemedText style={styles.successCheckmark}>✓</ThemedText>
            </View>
          </View>
          <ThemedText variant="text-xl-bold" style={styles.successTitle}>
            Order Successful!
          </ThemedText>

          <ThemedText variant="text-base-regular" style={styles.successSubtitle}>
            Thank you for your purchase
          </ThemedText>

          <ThemedText variant="text-sm-regular" style={styles.successDescription}>
            Your order has been successfully placed and is being processed. You will receive a confirmation email
            shortly with your order details.
          </ThemedText>

          <View style={styles.successOrderDetails}>
            <View style={styles.successOrderRow}>
              <ThemedText variant="text-sm-medium" style={styles.successOrderLabel}>
                Order Number:
              </ThemedText>
              <ThemedText variant="text-sm-semibold" style={styles.successOrderValue}>
                #{orderNumber}
              </ThemedText>
            </View>
            <View style={styles.successOrderRow}>
              <ThemedText variant="text-sm-medium" style={styles.successOrderLabel}>
                Estimated Delivery:
              </ThemedText>
              <ThemedText variant="text-sm-semibold" style={styles.successOrderValue}>
                3-5 business days
              </ThemedText>
            </View>
            <View style={styles.successOrderRow}>
              <ThemedText variant="text-sm-medium" style={styles.successOrderLabel}>
                Total Amount:
              </ThemedText>
              <ThemedText variant="text-sm-semibold" style={styles.successOrderValue}>
                €{total.toFixed(2)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.successButtonContainer}>
            <Pressable
              style={({ pressed }) => [styles.successPrimaryButton, pressed && { opacity: 0.9 }]}
              onPress={handleContinueShopping}
              accessibilityRole="button"
              accessibilityLabel="Continue shopping"
            >
              <ThemedText variant="text-base-bold" style={styles.successPrimaryButtonText}>
                Continue Shopping
              </ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.successCloseButton, pressed && { opacity: 0.9 }]}
              onPress={handleCloseSuccessModal}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <ThemedText variant="text-base-semibold" style={styles.successCloseButtonText}>
                Close
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )


  const CountrySelectionModal = () => (
    <Modal
      visible={showCountryModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowCountryModal(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setShowCountryModal(false)}>
        <View style={[styles.modalContent, isWide && styles.modalContentWide]}>
          <View style={styles.modalHeader}>
            <ThemedText variant="text-lg-semibold" style={styles.modalTitle}>
              Select Country
            </ThemedText>
            <Pressable onPress={() => setShowCountryModal(false)}>
              <ThemedText style={styles.modalClose}>✕</ThemedText>
            </Pressable>
          </View>
          <ScrollView style={styles.modalScrollView}>
            {europeanCountries.map((country) => (
              <Pressable
                key={country.code}
                style={[styles.modalItem, form.country === country.code && styles.modalItemSelected]}
                onPress={() => handleCountrySelect(country)}
              >
                <ThemedText variant="text-sm-medium"
                  style={[styles.modalItemText, form.country === country.code && styles.modalItemTextSelected]}
                >
                  {country.name}
                </ThemedText>
                {form.country === country.code && <ThemedText style={styles.modalItemCheck}>✓</ThemedText>}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  )

  const StateSelectionModal = () => (
    <Modal
      visible={showStateModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowStateModal(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setShowStateModal(false)}>
        <View style={[styles.modalContent, isWide && styles.modalContentWide]}>
          <View style={styles.modalHeader}>
            <ThemedText variant="text-lg-semibold" style={styles.modalTitle}>
              Select State
            </ThemedText>
            <Pressable onPress={() => setShowStateModal(false)}>
              <ThemedText style={styles.modalClose}>✕</ThemedText>
            </Pressable>
          </View>
          <ScrollView style={styles.modalScrollView}>
            {availableStates.length > 0 ? (
              availableStates.map((state) => (
                <Pressable
                  key={state.code}
                  style={[styles.modalItem, form.state === state.code && styles.modalItemSelected]}
                  onPress={() => handleStateSelect(state)}
                >
                  <ThemedText variant="text-sm-medium" style={[styles.modalItemText, form.state === state.code && styles.modalItemTextSelected]}>
                    {state.name}
                  </ThemedText>
                  {form.state === state.code && <ThemedText style={styles.modalItemCheck}>✓</ThemedText>}
                </Pressable>
              ))
            ) : (
              <View style={styles.modalEmptyState}>
                <ThemedText style={styles.modalEmptyText}>No states available for this country</ThemedText>
              </View>
            )}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  )

  if (isWide) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <View style={styles.container}>
          <Header />
          <ScrollView contentContainerStyle={styles.webScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.webContentWrapper}>
              <View style={styles.webMainContent}>
                <View style={styles.webFormCard}>
                  <ThemedText variant="text-lg-semibold" style={styles.formTitle}>
                    Billing Details
                  </ThemedText>
                  <View style={styles.formRow}>
                    <View style={styles.formFieldHalf}>
                      <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                        First name
                      </ThemedText>
                      <TextInput
                        style={styles.textInputWide}
                        value={form.firstName}
                        onChangeText={(v) => handleChange("firstName", v)}
                        placeholder="Enter your first name"
                        placeholderTextColor={Colors.light.gray500}
                      />
                    </View>
                    <View style={styles.formFieldHalf}>
                      <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                        Last name
                      </ThemedText>
                      <TextInput
                        style={styles.textInputWide}
                        value={form.lastName}
                        onChangeText={(v) => handleChange("lastName", v)}
                        placeholder="Enter your last name"
                        placeholderTextColor={Colors.light.gray400}
                      />
                    </View>
                  </View>
                  <View style={styles.formField}>
                    <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                      Company
                    </ThemedText>
                    <TextInput
                      style={styles.textInputWide}
                      value={form.company}
                      onChangeText={(v) => handleChange("company", v)}
                      placeholder="Enter your company name"
                      placeholderTextColor={Colors.light.gray400}
                    />
                  </View>
                  <View style={styles.formField}>
                    <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                      VAT number
                    </ThemedText>
                    <TextInput
                      style={styles.textInputWide}
                      value={form.vat}
                      onChangeText={(v) => handleChange("vat", v)}
                      placeholder="Enter your VAT number"
                      placeholderTextColor={Colors.light.gray400}
                    />
                  </View>
                  <View style={styles.formField}>
                    <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                      Phone number
                    </ThemedText>
                    <TextInput
                      style={styles.textInputWide}
                      value={form.phone}
                      onChangeText={(v) => handleChange("phone", v)}
                      placeholder="012334455"
                      placeholderTextColor={Colors.light.gray400}
                      keyboardType="phone-pad"
                    />
                  </View>
                  <View style={styles.formField}>
                    <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                      Country
                    </ThemedText>
                    <Pressable style={styles.selectInput} onPress={() => setShowCountryModal(true)}>
                      <ThemedText style={styles.selectTextWide}>{getCountryName(form.country)}</ThemedText>
                      <ThemedText style={styles.selectArrow}>▼</ThemedText>
                    </Pressable>
                  </View>
                  <View style={styles.formField}>
                    <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                      State
                    </ThemedText>
                    <Pressable
                      style={[styles.selectInput, !availableStates.length && styles.selectInputDisabled]}
                      onPress={() => availableStates.length > 0 && setShowStateModal(true)}
                    >
                      <ThemedText style={[styles.selectTextWide, !availableStates.length && styles.selectTextDisabled]}>
                        {form.state
                          ? getStateName(form.state)
                          : availableStates.length > 0
                            ? "Select a state"
                            : "No states available"}
                      </ThemedText>
                      {availableStates.length > 0 && <ThemedText style={styles.selectArrow}>▼</ThemedText>}
                    </Pressable>
                  </View>
                  <View style={styles.formField}>
                    <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                      Address line 1
                    </ThemedText>
                    <TextInput
                      style={styles.textInputWide}
                      value={form.address1}
                      onChangeText={(v) => handleChange("address1", v)}
                      placeholder="House number and street name"
                      placeholderTextColor={Colors.light.gray400}
                    />
                  </View>
                  <View style={styles.formField}>
                    <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                      Address line 2
                    </ThemedText>
                    <TextInput
                      style={styles.textInputWide}
                      value={form.address2}
                      onChangeText={(v) => handleChange("address2", v)}
                      placeholder="House number and street name"
                      placeholderTextColor={Colors.light.gray400}
                    />
                  </View>
                  <View style={styles.formRow}>
                    <View style={styles.formFieldHalf}>
                      <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                        City
                      </ThemedText>
                      <TextInput
                        style={styles.textInputWide}
                        value={form.city}
                        onChangeText={(v) => handleChange("city", v)}
                        placeholder="City"
                        placeholderTextColor={Colors.light.gray400}
                      />
                    </View>
                    <View style={styles.formFieldHalf}>
                      <ThemedText variant="text-xs-medium" style={styles.fieldLabelWide}>
                        Zip Code
                      </ThemedText>
                      <TextInput
                        style={styles.textInputWide}
                        value={form.zip}
                        onChangeText={(v) => handleChange("zip", v)}
                        placeholder="Zip code"
                        placeholderTextColor={Colors.light.gray400}
                      />
                    </View>
                  </View>
                  <View style={styles.deliverySection}>
                    <ThemedText variant="text-lg-bold" style={styles.deliveryTitle}>
                      Delivery
                    </ThemedText>
                    <View style={styles.deliveryOptionContainer}>
                      <Pressable
                        style={[styles.deliveryOption, form.delivery === "ship" && styles.deliveryOptionSelected]}
                        onPress={() => handleChange("delivery", "ship")}
                      >
                        <View style={styles.radioButton}>
                          <View style={[styles.radioOuter, form.delivery === "ship" && styles.radioOuterActive]}>
                            {form.delivery === "ship" && <View style={styles.radioInner} />}
                          </View>
                        </View>
                        <ThemedText variant="text-sm-semibold" style={styles.deliveryOptionText}>
                          Ship
                        </ThemedText>
                        <ShipIcon />
                      </Pressable>

                      <Pressable
                        style={[
                          styles.deliveryOption,
                          styles.pickUpOption,
                          form.delivery === "pickup" && styles.deliveryOptionSelected,
                        ]}
                        onPress={() => handleChange("delivery", "pickup")}
                      >
                        <View style={styles.radioButton}>
                          <View style={[styles.radioOuter, form.delivery === "pickup" && styles.radioOuterActive]}>
                            {form.delivery === "pickup" && <View style={styles.radioInner} />}
                          </View>
                        </View>
                        <ThemedText variant="text-sm-semibold" style={styles.deliveryOptionText}>
                          Pickup in store
                        </ThemedText>
                        <StoreIcon />
                      </Pressable>
                    </View>

                    <Pressable
                      style={styles.checkboxOption}
                      onPress={() => handleChange("shipToDifferent", !form.shipToDifferent)}
                    >
                      <View style={styles.checkboxButton}>
                        <View style={[styles.checkboxOuter, form.shipToDifferent && styles.checkboxOuterActive]}>
                          {form.shipToDifferent && <ThemedText style={styles.checkboxCheck}>✓</ThemedText>}
                        </View>
                      </View>
                      <ThemedText style={styles.checkboxOptionText}>Ship to a different address?</ThemedText>
                    </Pressable>
                  </View>
                  <Pressable
                    style={[styles.payButton, !isFormValid() && styles.payButtonDisabled]}
                    onPress={handlePayNow}
                    disabled={!isFormValid()}
                  >
                    <ThemedText variant="text-base-bold" style={styles.payButtonText}>
                      Pay now
                    </ThemedText>
                  </Pressable>
                </View>
                <SummarySection />
              </View>
            </View>
            <Footer/>
          </ScrollView>
          <CountrySelectionModal />
          <StateSelectionModal />
          <SuccessModal />
        </View>
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <View style={styles.container}>
        <Header />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.mobileScrollContent} showsVerticalScrollIndicator={false}>
            <SummarySection />
            <View style={styles.mobileFormCard}>
              <ThemedText variant="text-base-semibold" style={styles.formTitle}>
                Billing Details
              </ThemedText>
              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  First name
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={form.firstName}
                  onChangeText={(v) => handleChange("firstName", v)}
                  placeholder="Enter your first name"
                  placeholderTextColor={Colors.light.gray400}
                />
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  Last name
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={form.lastName}
                  onChangeText={(v) => handleChange("lastName", v)}
                  placeholder="Enter your last name"
                  placeholderTextColor={Colors.light.gray400}
                />
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  Company
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={form.company}
                  onChangeText={(v) => handleChange("company", v)}
                  placeholder="Enter your company name"
                  placeholderTextColor={Colors.light.gray400}
                />
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  VAT number
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={form.vat}
                  onChangeText={(v) => handleChange("vat", v)}
                  placeholder="Enter your VAT number"
                  placeholderTextColor={Colors.light.gray400}
                />
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  Phone number
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={form.phone}
                  onChangeText={(v) => handleChange("phone", v)}
                  placeholder="012334455"
                  placeholderTextColor={Colors.light.gray400}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  Country
                </ThemedText>
                <Pressable style={styles.selectInput} onPress={() => setShowCountryModal(true)}>
                  <ThemedText style={styles.selectText}>{getCountryName(form.country)}</ThemedText>
                  <ThemedText style={styles.selectArrow}>▼</ThemedText>
                </Pressable>
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  State
                </ThemedText>
                <Pressable
                  style={[styles.selectInput, !availableStates.length && styles.selectInputDisabled]}
                  onPress={() => availableStates.length > 0 && setShowStateModal(true)}
                >
                  <ThemedText style={[styles.selectText, !availableStates.length && styles.selectTextDisabled]}>
                    {form.state
                      ? getStateName(form.state)
                      : availableStates.length > 0
                        ? "Select a state"
                        : "No states available"}
                  </ThemedText>
                  {availableStates.length > 0 && <ThemedText style={styles.selectArrow}>▼</ThemedText>}
                </Pressable>
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  Address line 1
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={form.address1}
                  onChangeText={(v) => handleChange("address1", v)}
                  placeholder="House number and street name"
                  placeholderTextColor={Colors.light.gray400}
                />
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  Address line 2
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={form.address2}
                  onChangeText={(v) => handleChange("address2", v)}
                  placeholder="House number and street name"
                  placeholderTextColor={Colors.light.gray500}
                />
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  City
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={form.city}
                  onChangeText={(v) => handleChange("city", v)}
                  placeholder="City"
                  placeholderTextColor={Colors.light.gray400}
                />
              </View>

              <View style={styles.formField}>
                <ThemedText variant="text-xs-medium" style={styles.fieldLabel}>
                  Zip Code
                </ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={form.zip}
                  onChangeText={(v) => handleChange("zip", v)}
                  placeholder="Zip code"
                  placeholderTextColor={Colors.light.gray400}
                />
              </View>

              {/* Delivery Section */}
              <View style={styles.deliverySection}>
                <ThemedText variant="text-lg-bold" style={styles.deliveryTitle}>
                  Delivery
                </ThemedText>
                <View style={styles.deliveryOptionContainer}>
                  <Pressable
                    style={[styles.deliveryOption, form.delivery === "ship" && styles.deliveryOptionSelected]}
                    onPress={() => handleChange("delivery", "ship")}
                  >
                    <View style={styles.radioButton}>
                      <View style={[styles.radioOuter, form.delivery === "ship" && styles.radioOuterActive]}>
                        {form.delivery === "ship" && <View style={styles.radioInner} />}
                      </View>
                    </View>
                    <ThemedText style={styles.deliveryOptionText}>Ship</ThemedText>
                    <ShipIcon />
                  </Pressable>

                  <Pressable
                    style={[
                      styles.deliveryOption,
                      styles.pickUpOption,
                      form.delivery === "pickup" && styles.deliveryOptionSelected,
                    ]}
                    onPress={() => handleChange("delivery", "pickup")}
                  >
                    <View style={styles.radioButton}>
                      <View style={[styles.radioOuter, form.delivery === "pickup" && styles.radioOuterActive]}>
                        {form.delivery === "pickup" && <View style={styles.radioInner} />}
                      </View>
                    </View>
                    <ThemedText style={styles.deliveryOptionText}>Pickup in store</ThemedText>
                    <StoreIcon />
                  </Pressable>
                </View>

                <Pressable
                  style={styles.checkboxOption}
                  onPress={() => handleChange("shipToDifferent", !form.shipToDifferent)}
                >
                  <View style={styles.checkboxButton}>
                    <View style={[styles.checkboxOuter, form.shipToDifferent && styles.checkboxOuterActive]}>
                      {form.shipToDifferent && <ThemedText style={styles.checkboxCheck}>✓</ThemedText>}
                    </View>
                  </View>
                  <ThemedText style={styles.checkboxOptionText}>Ship to a different address?</ThemedText>
                </Pressable>
              </View>
              <Pressable
                style={[styles.payButton, !isFormValid() && styles.payButtonDisabled]}
                onPress={handlePayNow}
                disabled={!isFormValid()}
              >
                <ThemedText variant="text-base-bold" style={styles.payButtonText}>
                  Pay now
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <CountrySelectionModal />
        <StateSelectionModal />
        <SuccessModal />
      </View>
    </Suspense>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },

  webScrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  webContentWrapper: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  webMainContent: {
    flexDirection: "row",
    maxWidth: 1200,
    width: "100%",
    gap: 40,
    alignItems: "flex-start",
  },
  webFormCard: {
    flex: 2,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 32,
    elevation: 3,
  },

  mobileScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
  },
  mobileFormCard: {

    borderRadius: 12,
    padding: 24,
  
  },


  summaryCard: {
    backgroundColor: Colors.light.gray50,
    borderRadius: 12,
    padding: 24,
  },
  summaryCardWide: {
    flex: 1,
    maxWidth: 400,
    alignSelf: "flex-start",
  },
  summaryCardMobile: {
    width: "100%",
  },
  summaryTitle: {
    color: Colors.light.text,
    marginBottom: 20,
  },
  summaryContent: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryRowTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray200,
    paddingTop: 30,
    marginTop: 30,
  },
  summaryLabel: {
    color: Colors.light.gray500,
  },
  summaryValue: {
    color: Colors.light.gray700,
  },
  summaryTotalLabel: {
    color: Colors.light.gray700,
  },
  summaryTotalValue: {
    color: Colors.light.gray700,
  },


  formTitle: {
    color: Colors.light.gray700,
    marginBottom: 24,
  },
  formRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  formField: {
    marginBottom: 20,
    position: "relative",
    zIndex: 1, 
  },
  formFieldHalf: {
    flex: 1,
  },
  formFieldThird: {
    flex: 1,
  },
  fieldLabel: {
    color: Colors.light.gray700,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "500",
  },
  fieldLabelWide: {
    color: Colors.light.gray700,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
  textInputWide: {
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
  },
  selectInputDisabled: {
    backgroundColor: Colors.light.gray100,
    borderColor: Colors.light.gray200,
  },
  selectText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  selectTextWide: {
    fontSize: 16,
    color: Colors.light.text,
  },
  selectTextDisabled: {
    color: Colors.light.gray500,
  },
  selectArrow: {
    fontSize: 12,
    color: Colors.light.gray500,
  },

  deliverySection: {
    marginTop: 15,
    marginBottom: 20,
    paddingBottom: 20,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray100,
  },
  deliveryOptionContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.gray200,
    padding: 15,
    backgroundColor: Colors.light.background,
  },
  deliveryTitle: {
    color: Colors.light.text,
    marginBottom: 16,
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pickUpOption: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray100,
    paddingTop: 22,
    marginTop: 10,
  },
  deliveryOptionSelected: {

  },
  deliveryOptionText: {
    flex: 1,
    color: Colors.light.text,
    marginLeft: 12,
  },
  radioButton: {
    marginRight: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.gray300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  radioOuterActive: {
    borderColor: Colors.light.secondary500,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.secondary500,
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  checkboxButton: {
    marginRight: 12,
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  checkboxOuterActive: {
    borderColor: Colors.light.secondary500,
    backgroundColor: Colors.light.secondary500,
  },
  checkboxCheck: {
    fontSize: 12,
    color: Colors.light.background,
    fontWeight: "bold",
  },
  checkboxOptionText: {
    fontSize: 16,
    color: Colors.light.text,
  },

  payButton: {
    backgroundColor: Colors.light.primary400,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: Colors.light.primary600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonDisabled: {
    backgroundColor: Colors.light.gray300,
    shadowOpacity: 0,
  },
  payButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    width: "100%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContentWide: {
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
  },
  modalTitle: {
    color: Colors.light.text,
  },
  modalClose: {
    fontSize: 18,
    color: Colors.light.gray600,
    padding: 8,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray100,
  },
  modalItemSelected: {
    backgroundColor: Colors.light.gray50,
  },
  modalItemText: {
    color: Colors.light.text,
  },
  modalItemTextSelected: {
    fontWeight: "600",
    color: Colors.light.primary400,
  },
  modalItemCheck: {
    color: Colors.light.primary400,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalEmptyState: {
    padding: 24,
    alignItems: "center",
  },
  modalEmptyText: {
    color: Colors.light.gray500,
    fontSize: 16,
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successModalContent: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  successModalContentWide: {
    maxWidth: 600,
    padding: 40,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.success500,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.success500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  successCheckmark: {
    fontSize: 32,
    color: Colors.light.background,
    fontWeight: "bold",
  },
  successTitle: {
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 8,
    fontSize: 24,
  },
  successSubtitle: {
    color: Colors.light.gray600,
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
  },
  successDescription: {
    color: Colors.light.gray600,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    fontSize: 14,
  },
  successOrderDetails: {
    backgroundColor: Colors.light.gray50,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    marginBottom: 24,
    gap: 12,
  },
  successOrderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  successOrderLabel: {
    color: Colors.light.gray600,
    fontSize: 14,
  },
  successOrderValue: {
    color: Colors.light.text,
    fontSize: 14,
  },
  successButtonContainer: {
    width: "100%",
    gap: 12,
  },
  successPrimaryButton: {
    backgroundColor: Colors.light.primary400,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: Colors.light.primary400,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  successPrimaryButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
  },
  successCloseButton: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.gray300,
  },
  successCloseButtonText: {
    color: Colors.light.gray600,
    fontSize: 16,
    fontWeight: "600",
  },
})
