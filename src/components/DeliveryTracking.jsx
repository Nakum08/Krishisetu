import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DeliveryTracking = ({ status }) => {
  const steps = [
    { id: 'ordered', label: 'Order Placed', icon: 'checkmark-circle' },
    { id: 'processing', label: 'Processing', icon: 'clipboard' },
    { id: 'shipped', label: 'Shipped', icon: 'cube' },
    { id: 'delivered', label: 'Delivered', icon: 'home' },
  ];
  
  let currentStepIndex;
  switch (status) {
    case 'pending':
      currentStepIndex = 0;
      break;
    case 'processing':
      currentStepIndex = 1;
      break;
    case 'shipped':
      currentStepIndex = 2;
      break;
    case 'delivered': 
      currentStepIndex = 3;
      break;
    default:
      currentStepIndex = 0;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Delivery Status</Text>
      
      <View style={styles.trackingContainer}>
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isActive = index === currentStepIndex;
          
          return (
            <View key={step.id} style={styles.stepContainer}>
              <View style={styles.stepIconContainer}>
                <View style={[
                  styles.stepIcon,
                  isCompleted ? styles.completedStepIcon : styles.pendingStepIcon,
                  isActive ? styles.activeStepIcon : null,
                ]}>
                  <Ionicons 
                    name={isCompleted ? step.icon : `${step.icon}-outline`}
                    size={20}
                    color={isCompleted ? '#fff' : '#999'}
                  />
                </View>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <View style={[
                    styles.connector,
                    index < currentStepIndex ? styles.completedConnector : styles.pendingConnector,
                  ]} />
                )}
              </View>
              
              <Text style={[
                styles.stepLabel,
                isActive ? styles.activeStepLabel : (isCompleted ? styles.completedStepLabel : styles.pendingStepLabel),
              ]}>
                {step.label}
              </Text>
              
              {isActive && (
                <Text style={styles.activeStepDescription}>
                  {status === 'pending' && 'Your order has been received and is being verified.'}
                  {status === 'processing' && 'Your order is being processed and packed.'}
                  {status === 'shipped' && 'Your order is on its way to you.'}
                  {status === 'delivered' && 'Your order has been delivered.'}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  trackingContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  stepContainer: {
    marginBottom: 16,
    paddingLeft: 40,
    position: 'relative',
  },
  stepIconContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  pendingStepIcon: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  completedStepIcon: {
    backgroundColor: '#4CAF50',
  },
  activeStepIcon: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  connector: {
    position: 'absolute',
    top: 36,
    width: 2,
    bottom: -16,
    zIndex: 1,
  },
  completedConnector: {
    backgroundColor: '#4CAF50',
  },
  pendingConnector: {
    backgroundColor: '#ddd',
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  pendingStepLabel: {
    color: '#999',
  },
  completedStepLabel: {
    color: '#333',
  },
  activeStepLabel: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  activeStepDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 12,
  },
});

export default DeliveryTracking;