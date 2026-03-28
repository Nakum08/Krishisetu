import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import UnifiedHeader from '../components/UnifiedHeader';
import LinearGradient from 'react-native-linear-gradient';

const AboutUsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const openDialer = () => {
    Linking.openURL('tel:+917433857006');
  };
  
  const openEmail = () => {
    Linking.openURL('mailto:contact@srushtiinfotech.com');
  };
  
  const openWebsite = () => {
    Linking.openURL('https://srushtiinfotech.com');
  };
  
  const developers = [
    { name: "Viral Gujarati", role: "Lead Developer & Full Stack Developer" },
    { name: "Yash Dangashiya", role: "UI/UX Designer & Front End Developer" },
    { name: "Harshvi Patel", role: "Full Stack Developer & DBA" }
  ];

  return (
    <View style={styles.container}>
      <UnifiedHeader
        title={t('profile.aboutUs')}
        subtitle={t('aboutUs.subtitle')}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Company Info Card */}
        <LinearGradient
          colors={['#4CAF50', '#2E7D32']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.companyBanner}
        >
          <Text style={styles.companyName}>{t('aboutUs.companyName')}</Text>
          <Text style={styles.tagline}>{t('aboutUs.tagline')}</Text>
        </LinearGradient>
        
        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>{t('aboutUs.connectWithUs')}</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={openDialer}>
            <Icon name="call" size={24} color="#388E3C" />
            <Text style={styles.contactText}>+91 74338 57006</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
            <Icon name="mail" size={24} color="#388E3C" />
            <Text style={styles.contactText}>contact@srushtiinfotech.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
            <Icon name="globe" size={24} color="#388E3C" />
            <Text style={styles.contactText}>www.srushtiinfotech.com</Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <Icon name="location" size={24} color="#388E3C" />
            <Text style={styles.contactText}>University Road, Rajkot, Gujarat, India</Text>
          </View>
        </View>
        
        {/* Mission Statement */}
        <View style={styles.missionCard}>
          <Text style={styles.sectionTitle}>{t('aboutUs.ourMission')}</Text>
          <Text style={styles.missionText}>
            {t('aboutUs.missionText')}
          </Text>
        </View>
        
        {/* Team Section */}
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>{t('aboutUs.meetOurTeam')}</Text>
          <Text style={styles.teamSubtitle}>{t('aboutUs.teamSubtitle')}</Text>
          
          <View style={styles.teamGrid}>
            {developers.map((dev, index) => (
              <View key={index} style={styles.teamMember}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{dev.name.charAt(0)}</Text>
                </View>
                <Text style={styles.developerName}>{dev.name}</Text>
                <Text style={styles.developerRole}>{dev.role}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('aboutUs.footerText')}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  companyBanner: {
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#E8F5E9',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#424242',
    marginLeft: 12,
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  missionText: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
    textAlign: 'center',
  },
  teamSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  teamSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  teamMember: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  developerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginTop: 8,
  },
  developerRole: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  footer: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#757575',
  },
});

export default AboutUsScreen;