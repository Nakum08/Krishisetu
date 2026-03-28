import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UnifiedHeader from '../components/UnifiedHeader';
import { useTranslation } from 'react-i18next';

const PaymentProcessingScreen = ({ route, navigation }) => {
  const { order } = route.params || {};
  const { t } = useTranslation();
  const [paymentStatus, setPaymentStatus] = useState('input');
  const [timer, setTimer] = useState(3);
  
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  const startPaymentProcessing = () => {
    if (order.paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        Alert.alert(t('payment.invalidUpiId'), t('payment.enterValidUpiId'));
        return;
      }
    } else if (order.paymentMethod === 'card') {
      if (!cardNumber || cardNumber.length < 16 || 
          !cardExpiry || cardExpiry.length < 5 || 
          !cardCvv || cardCvv.length < 3 ||
          !cardName) {
        Alert.alert(t('payment.invalidCardDetails'), t('payment.enterCardDetailsCorrectly'));
        return;
      }
    }
    
    setPaymentStatus('processing');
  };
  
  useEffect(() => {
    let interval;
    let timeout;
    
    if (paymentStatus === 'processing') {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      
      timeout = setTimeout(() => {
        const isSuccess = Math.random() < 0.9;
        setPaymentStatus(isSuccess ? 'success' : 'failed');
      }, 3000);
    }
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paymentStatus]);
  
  useEffect(() => {
    if (paymentStatus === 'success') {
      const updatedOrder = {
        ...order,
        paymentStatus: 'paid',
        status: 'confirmed' 
      };
      
      setTimeout(() => {
        navigation.replace('OrderConfirmationScreen', { order: updatedOrder });
      }, 1500);
    }
  }, [paymentStatus, order, navigation]);
  
  const handleRetryPayment = () => {
    setPaymentStatus('input');
  };
  
  const handleCancelPayment = () => {
    Alert.alert(
      'Cancel Payment',
      'Would you like to switch to Cash on Delivery instead?',
      [
        {
          text: 'No, Go Back',
          style: 'cancel',
          onPress: () => navigation.goBack()
        },
        {
          text: 'Yes, Use COD',
          onPress: () => {
            const updatedOrder = {
              ...order,
              paymentMethod: 'cod',
              status: 'confirmed'
            };
            navigation.replace('OrderConfirmationScreen', { order: updatedOrder });
          }
        }
      ]
    );
  };
  
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const match = cleaned.match(/\d{1,4}/g);
    const formatted = match ? match.join(' ') : '';
    return formatted.slice(0, 19); 
  };
  
  const formatCardExpiry = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };
  
  const renderUpiInput = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Enter UPI ID</Text>
      <TextInput
        style={styles.textInput}
        placeholder="yourname@upi"
        value={upiId}
        onChangeText={setUpiId}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.inputHelper}>Example: name@okicici, name@okaxis, name@ybl</Text>
      
      <TouchableOpacity style={styles.payButton} onPress={startPaymentProcessing}>
        <Text style={styles.payButtonText}>Proceed to Pay ₹{order.total.toFixed(2)}</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderCardInput = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Card Number</Text>
      <TextInput
        style={styles.textInput}
        placeholder="1234 5678 9012 3456"
        value={cardNumber}
        onChangeText={(text) => setCardNumber(formatCardNumber(text))}
        keyboardType="number-pad"
        maxLength={19}
      />
      
      <Text style={styles.inputLabel}>Cardholder Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="JOHN SMITH"
        value={cardName}
        onChangeText={setCardName}
        autoCapitalize="characters"
      />
      
      <View style={styles.cardExtraFields}>
        <View style={styles.expiryContainer}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.textInput}
            placeholder="MM/YY"
            value={cardExpiry}
            onChangeText={(text) => {
              if (text.length <= 5) {
                setCardExpiry(formatCardExpiry(text));
              }
            }}
            keyboardType="number-pad"
            maxLength={5}
          />
        </View>
        
        <View style={styles.cvvContainer}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.textInput}
            placeholder="123"
            value={cardCvv}
            onChangeText={(text) => {
              if (text.length <= 3) {
                setCvv(text.replace(/[^0-9]/g, ''));
              }
            }}
            keyboardType="number-pad"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>
      
      <TouchableOpacity style={styles.payButton} onPress={startPaymentProcessing}>
        <Text style={styles.payButtonText}>Pay ₹{order.total.toFixed(2)}</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderPaymentProcessing = () => (
    <View style={styles.contentContainer}>
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      <Text style={styles.processingText}>Processing Payment</Text>
      <Text style={styles.timerText}>Please wait... {timer}</Text>
      <Text style={styles.infoText}>Please do not close this page or press back button.</Text>
    </View>
  );
  
  const renderPaymentSuccess = () => (
    <View style={styles.contentContainer}>
      <View style={styles.successIconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      </View>
      <Text style={styles.successText}>Payment Successful!</Text>
      <Text style={styles.amountText}>₹{order.total.toFixed(2)}</Text>
      <Text style={styles.redirectingText}>Redirecting to order confirmation...</Text>
    </View>
  );
  
  // Render payment failed view
  const renderPaymentFailed = () => (
    <View style={styles.contentContainer}>
      <View style={styles.failedIconContainer}>
        <Ionicons name="close-circle" size={80} color="#FF5252" />
      </View>
      <Text style={styles.failedText}>Payment Failed!</Text>
      <Text style={styles.failedInfoText}>
        We couldn't process your payment. Please try again or choose a different payment method.
      </Text>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetryPayment}>
          <Text style={styles.retryButtonText}>Retry Payment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPayment}>
          <Text style={styles.cancelButtonText}>Change Payment Method</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
<UnifiedHeader
        title="Payment"
        subtitle="Complete Your Payment"
        />        <View style={styles.header}>
          <Image 
            source={require('../assets/payment.png')} 
            style={styles.gatewayLogo} 
            // defaultSource={require('../assets/login.jpg')}
          />
          <Text style={styles.headerText}>
            {order.paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
          </Text>
        </View>
        
        <View style={styles.orderInfoContainer}>
          <Text style={styles.orderIdText}>Order #{order.id}</Text>
          <Text style={styles.merchantText}>FarmFresh Organic Store</Text>
          <Text style={styles.amountBadge}>Amount: ₹{order.total.toFixed(2)}</Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {paymentStatus === 'input' && (
            <>
              {order.paymentMethod === 'upi' ? renderUpiInput() : renderCardInput()}
            </>
          )}
          {paymentStatus === 'processing' && renderPaymentProcessing()}
          {paymentStatus === 'success' && renderPaymentSuccess()}
          {paymentStatus === 'failed' && renderPaymentFailed()}
        </ScrollView>
        
        {paymentStatus === 'input' && (
          <TouchableOpacity style={styles.cancelPaymentButton} onPress={handleCancelPayment}>
            <Text style={styles.cancelPaymentText}>Cancel Payment</Text>
          </TouchableOpacity>
        )}
        
        {paymentStatus === 'processing' && (
          <TouchableOpacity style={styles.cancelPaymentButton} onPress={handleCancelPayment}>
            <Text style={styles.cancelPaymentText}>Cancel Payment</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  gatewayLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: '#DDD',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  orderInfoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  orderIdText: {
    fontSize: 14,
    color: '#555555',
  },
  merchantText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginTop: 4,
  },
  amountBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    color: '#4CAF50',
    fontWeight: '500',
  },
  inputContainer: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  inputHelper: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 24,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cardExtraFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiryContainer: {
    flex: 1,
    marginRight: 10,
  },
  cvvContainer: {
    flex: 1,
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loader: {
    marginBottom: 20,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  redirectingText: {
    fontSize: 14,
    color: '#757575',
  },
  failedIconContainer: {
    marginBottom: 20,
  },
  failedText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FF5252',
    marginBottom: 10,
  },
  failedInfoText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 30,
  },
  actionButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelPaymentButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  cancelPaymentText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PaymentProcessingScreen;