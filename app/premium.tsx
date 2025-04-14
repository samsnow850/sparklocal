import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Filter, 
  Download, 
  Sparkles, 
  Zap, 
  Clock
} from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

export default function PremiumScreen() {
  const { colors, isDark } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  
  const plans: PricingPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$4.99',
      period: 'per month',
      description: 'Full access to all premium features',
      features: [
        'Advanced filters',
        'Offline mode',
        'Exclusive date ideas',
        'No ads',
        'Priority support'
      ],
      popular: false
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$39.99',
      period: 'per year',
      description: 'Save 33% with annual billing',
      features: [
        'All monthly features',
        'Early access to new features',
        'Personalized recommendations',
        'Date planning calendar',
        'Custom widgets'
      ],
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$99.99',
      period: 'one-time payment',
      description: 'Pay once, use forever',
      features: [
        'All yearly features',
        'Free upgrades forever',
        'Exclusive seasonal content',
        'Premium date templates',
        'VIP community access'
      ],
      popular: false
    }
  ];
  
  const handleSubscribe = () => {
    // In a real app, this would integrate with a payment processor
    Alert.alert(
      'Subscription',
      'This would initiate the payment process in a real app.',
      [{ text: 'OK' }]
    );
  };
  
  const goBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>SparkLocal Premium</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80' }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Upgrade Your Dating Experience</Text>
            <Text style={styles.heroSubtitle}>
              Unlock premium features to discover even more amazing date ideas
            </Text>
          </View>
        </View>
        
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Premium Features</Text>
          
          <View style={styles.featuresGrid}>
            <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <Filter size={24} color={colors.primary} style={styles.featureIcon} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>Advanced Filters</Text>
              <Text style={[styles.featureDescription, { color: colors.subtext }]}>
                Filter by more specific criteria like time of day, indoor/outdoor, and more
              </Text>
            </View>
            
            <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <Download size={24} color={colors.primary} style={styles.featureIcon} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>Offline Mode</Text>
              <Text style={[styles.featureDescription, { color: colors.subtext }]}>
                Access your saved date ideas even without an internet connection
              </Text>
            </View>
            
            <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <Sparkles size={24} color={colors.primary} style={styles.featureIcon} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>Exclusive Ideas</Text>
              <Text style={[styles.featureDescription, { color: colors.subtext }]}>
                Access premium date ideas not available to free users
              </Text>
            </View>
            
            <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <Zap size={24} color={colors.primary} style={styles.featureIcon} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>Early Access</Text>
              <Text style={[styles.featureDescription, { color: colors.subtext }]}>
                Be the first to try new features before they're released to everyone
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.plansSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Your Plan</Text>
          
          <View style={styles.plansContainer}>
            {plans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  { 
                    backgroundColor: colors.card,
                    borderColor: selectedPlan === plan.id ? colors.primary : 'transparent',
                    borderWidth: selectedPlan === plan.id ? 2 : 0,
                  }
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                    <Star size={12} color="white" fill="white" />
                    <Text style={styles.popularText}>POPULAR</Text>
                  </View>
                )}
                
                <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                
                <View style={styles.planPriceContainer}>
                  <Text style={[styles.planPrice, { color: colors.text }]}>{plan.price}</Text>
                  <Text style={[styles.planPeriod, { color: colors.subtext }]}>{plan.period}</Text>
                </View>
                
                <Text style={[styles.planDescription, { color: colors.subtext }]}>
                  {plan.description}
                </Text>
                
                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <Check size={16} color={colors.primary} style={styles.featureCheck} />
                      <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: colors.primary }]}
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>
        
        <View style={styles.guaranteeSection}>
          <Clock size={20} color={colors.subtext} style={styles.guaranteeIcon} />
          <Text style={[styles.guaranteeText, { color: colors.subtext }]}>
            7-day money-back guarantee. Cancel anytime.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroSection: {
    position: 'relative',
    height: 200,
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  featuresSection: {
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  plansSection: {
    padding: 20,
    marginBottom: 24,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 4,
  },
  planPeriod: {
    fontSize: 14,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  planFeatures: {
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureCheck: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
  },
  subscribeButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  guaranteeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  guaranteeIcon: {
    marginRight: 8,
  },
  guaranteeText: {
    fontSize: 14,
  },
});
