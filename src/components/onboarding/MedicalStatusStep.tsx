import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Heart, AlertCircle, Pill, Activity, Bandage } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { usePlan } from '@/context/PlanContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * MedicalStatusStep: Collects detailed medical information
 *
 * This component allows users to provide information about their medical conditions,
 * medications, allergies, and injuries to ensure safe and appropriate workout plans.
 */

// Comprehensive list of health conditions organized by category
const cardiovascularConditions = [
  { id: 'hypertension', label: 'Hypertension (High Blood Pressure)' },
  { id: 'heart_disease', label: 'Heart Disease' },
  { id: 'arrhythmia', label: 'Arrhythmia (Irregular Heartbeat)' },
  { id: 'heart_failure', label: 'Heart Failure' },
  { id: 'coronary_artery_disease', label: 'Coronary Artery Disease' },
  { id: 'heart_valve_disease', label: 'Heart Valve Disease' },
  { id: 'congenital_heart_defect', label: 'Congenital Heart Defect' },
  { id: 'peripheral_artery_disease', label: 'Peripheral Artery Disease' },
  { id: 'deep_vein_thrombosis', label: 'Deep Vein Thrombosis (DVT)' },
  { id: 'aneurysm', label: 'Aneurysm' },
  { id: 'stroke_history', label: 'History of Stroke or TIA' },
];

const respiratoryConditions = [
  { id: 'asthma', label: 'Asthma' },
  { id: 'copd', label: 'COPD (Chronic Obstructive Pulmonary Disease)' },
  { id: 'sleep_apnea', label: 'Sleep Apnea' },
  { id: 'pulmonary_fibrosis', label: 'Pulmonary Fibrosis' },
  { id: 'chronic_bronchitis', label: 'Chronic Bronchitis' },
  { id: 'emphysema', label: 'Emphysema' },
  { id: 'cystic_fibrosis', label: 'Cystic Fibrosis' },
  { id: 'pulmonary_hypertension', label: 'Pulmonary Hypertension' },
  { id: 'tuberculosis', label: 'Tuberculosis' },
  { id: 'pneumonia_history', label: 'Recurrent Pneumonia' },
];

const metabolicConditions = [
  { id: 'diabetes_type1', label: 'Type 1 Diabetes' },
  { id: 'diabetes_type2', label: 'Type 2 Diabetes' },
  { id: 'prediabetes', label: 'Prediabetes' },
  { id: 'gestational_diabetes', label: 'Gestational Diabetes' },
  { id: 'metabolic_syndrome', label: 'Metabolic Syndrome' },
  { id: 'obesity', label: 'Obesity' },
  { id: 'hypoglycemia', label: 'Hypoglycemia' },
  { id: 'insulin_resistance', label: 'Insulin Resistance' },
  { id: 'pcos', label: 'Polycystic Ovary Syndrome (PCOS)' },
  { id: 'thyroid_hyper', label: 'Hyperthyroidism' },
  { id: 'thyroid_hypo', label: 'Hypothyroidism' },
  { id: 'hashimotos', label: 'Hashimoto\'s Thyroiditis' },
  { id: 'graves_disease', label: 'Graves\' Disease' },
  { id: 'adrenal_insufficiency', label: 'Adrenal Insufficiency' },
  { id: 'cushing_syndrome', label: 'Cushing\'s Syndrome' },
];

const musculoskeletalConditions = [
  { id: 'osteoarthritis', label: 'Osteoarthritis' },
  { id: 'rheumatoid_arthritis', label: 'Rheumatoid Arthritis' },
  { id: 'osteoporosis', label: 'Osteoporosis' },
  { id: 'osteopenia', label: 'Osteopenia' },
  { id: 'ankylosing_spondylitis', label: 'Ankylosing Spondylitis' },
  { id: 'gout', label: 'Gout' },
  { id: 'lupus', label: 'Lupus' },
  { id: 'fibromyalgia', label: 'Fibromyalgia' },
  { id: 'back_pain', label: 'Chronic Back Pain' },
  { id: 'herniated_disc', label: 'Herniated Disc' },
  { id: 'sciatica', label: 'Sciatica' },
  { id: 'scoliosis', label: 'Scoliosis' },
  { id: 'spinal_stenosis', label: 'Spinal Stenosis' },
  { id: 'degenerative_disc', label: 'Degenerative Disc Disease' },
  { id: 'bursitis', label: 'Bursitis' },
  { id: 'tendonitis', label: 'Tendonitis' },
  { id: 'carpal_tunnel', label: 'Carpal Tunnel Syndrome' },
  { id: 'joint_replacement', label: 'Joint Replacement' },
];

const neurologicalConditions = [
  { id: 'epilepsy', label: 'Epilepsy/Seizure Disorder' },
  { id: 'migraine', label: 'Migraine' },
  { id: 'multiple_sclerosis', label: 'Multiple Sclerosis (MS)' },
  { id: 'parkinsons', label: 'Parkinson\'s Disease' },
  { id: 'alzheimers', label: 'Alzheimer\'s Disease' },
  { id: 'dementia', label: 'Dementia' },
  { id: 'tbi', label: 'Traumatic Brain Injury (TBI)' },
  { id: 'neuropathy', label: 'Peripheral Neuropathy' },
  { id: 'vertigo', label: 'Vertigo/Balance Disorders' },
  { id: 'cerebral_palsy', label: 'Cerebral Palsy' },
  { id: 'als', label: 'ALS (Lou Gehrig\'s Disease)' },
  { id: 'myasthenia_gravis', label: 'Myasthenia Gravis' },
  { id: 'guillain_barre', label: 'Guillain-Barré Syndrome' },
];

const mentalHealthConditions = [
  { id: 'anxiety', label: 'Anxiety Disorder' },
  { id: 'depression', label: 'Depression' },
  { id: 'bipolar', label: 'Bipolar Disorder' },
  { id: 'ptsd', label: 'Post-Traumatic Stress Disorder (PTSD)' },
  { id: 'ocd', label: 'Obsessive-Compulsive Disorder (OCD)' },
  { id: 'adhd', label: 'ADHD/ADD' },
  { id: 'schizophrenia', label: 'Schizophrenia' },
  { id: 'eating_disorder', label: 'Eating Disorder' },
  { id: 'substance_use', label: 'Substance Use Disorder' },
  { id: 'insomnia', label: 'Chronic Insomnia' },
];

const digestiveConditions = [
  { id: 'ibs', label: 'Irritable Bowel Syndrome (IBS)' },
  { id: 'ibd', label: 'Inflammatory Bowel Disease (Crohn\'s, Ulcerative Colitis)' },
  { id: 'celiac', label: 'Celiac Disease' },
  { id: 'gerd', label: 'GERD (Acid Reflux)' },
  { id: 'peptic_ulcer', label: 'Peptic Ulcer Disease' },
  { id: 'gallbladder_disease', label: 'Gallbladder Disease' },
  { id: 'liver_disease', label: 'Liver Disease' },
  { id: 'pancreatitis', label: 'Pancreatitis' },
  { id: 'diverticulitis', label: 'Diverticulitis' },
  { id: 'gastroparesis', label: 'Gastroparesis' },
];

const immuneConditions = [
  { id: 'hiv', label: 'HIV/AIDS' },
  { id: 'autoimmune', label: 'Autoimmune Disorder' },
  { id: 'immunodeficiency', label: 'Primary Immunodeficiency' },
  { id: 'transplant', label: 'Organ Transplant Recipient' },
  { id: 'cancer', label: 'Cancer (Current or History)' },
  { id: 'chemotherapy', label: 'Currently Undergoing Chemotherapy' },
  { id: 'radiation', label: 'Currently Undergoing Radiation Therapy' },
];

const bloodDisorders = [
  { id: 'sickle_cell', label: 'Sickle Cell Disease/Trait' },
  { id: 'thalassemia', label: 'Thalassemia' },
  { id: 'hemophilia', label: 'Hemophilia' },
  { id: 'von_willebrand', label: 'Von Willebrand Disease' },
  { id: 'anemia', label: 'Anemia' },
  { id: 'iron_deficiency', label: 'Iron Deficiency' },
  { id: 'polycythemia', label: 'Polycythemia Vera' },
  { id: 'thrombocytopenia', label: 'Thrombocytopenia' },
  { id: 'leukemia', label: 'Leukemia (Current or History)' },
  { id: 'lymphoma', label: 'Lymphoma (Current or History)' },
  { id: 'myeloma', label: 'Multiple Myeloma' },
  { id: 'blood_clotting', label: 'Blood Clotting Disorder' },
  { id: 'g6pd', label: 'G6PD Deficiency' },
];

// Skin Conditions
const skinConditions = [
  { id: 'eczema', label: 'Eczema' },
  { id: 'psoriasis', label: 'Psoriasis' },
  { id: 'rosacea', label: 'Rosacea' },
  { id: 'acne', label: 'Severe Acne' },
  { id: 'hidradenitis', label: 'Hidradenitis Suppurativa' },
  { id: 'vitiligo', label: 'Vitiligo' },
  { id: 'urticaria', label: 'Chronic Urticaria (Hives)' },
  { id: 'dermatitis', label: 'Contact Dermatitis' },
  { id: 'keloids', label: 'Keloids' },
  { id: 'hyperhidrosis', label: 'Hyperhidrosis (Excessive Sweating)' },
];

// Urinary/Renal Conditions
const urinaryConditions = [
  { id: 'kidney_disease', label: 'Kidney Disease' },
  { id: 'kidney_stones', label: 'Kidney Stones' },
  { id: 'polycystic_kidney', label: 'Polycystic Kidney Disease' },
  { id: 'dialysis', label: 'Currently on Dialysis' },
  { id: 'incontinence', label: 'Urinary Incontinence' },
  { id: 'overactive_bladder', label: 'Overactive Bladder' },
  { id: 'interstitial_cystitis', label: 'Interstitial Cystitis' },
  { id: 'recurrent_uti', label: 'Recurrent UTIs' },
  { id: 'prostate_enlargement', label: 'Prostate Enlargement (BPH)' },
];

// Reproductive/Hormonal Conditions
const reproductiveConditions = [
  { id: 'pregnancy', label: 'Currently Pregnant' },
  { id: 'postpartum', label: 'Postpartum (Within Last Year)' },
  { id: 'endometriosis', label: 'Endometriosis' },
  { id: 'fibroids', label: 'Uterine Fibroids' },
  { id: 'menopause', label: 'Menopause/Perimenopause' },
  { id: 'pms', label: 'Severe PMS/PMDD' },
  { id: 'low_testosterone', label: 'Low Testosterone' },
  { id: 'erectile_dysfunction', label: 'Erectile Dysfunction' },
  { id: 'fertility_treatment', label: 'Currently Undergoing Fertility Treatment' },
  { id: 'hysterectomy', label: 'History of Hysterectomy' },
];

// Genetic/Rare Disorders
const geneticConditions = [
  { id: 'down_syndrome', label: 'Down Syndrome' },
  { id: 'marfan', label: 'Marfan Syndrome' },
  { id: 'ehlers_danlos', label: 'Ehlers-Danlos Syndrome' },
  { id: 'cystic_fibrosis', label: 'Cystic Fibrosis' },
  { id: 'muscular_dystrophy', label: 'Muscular Dystrophy' },
  { id: 'huntingtons', label: 'Huntington\'s Disease' },
  { id: 'fragile_x', label: 'Fragile X Syndrome' },
  { id: 'turner_syndrome', label: 'Turner Syndrome' },
  { id: 'klinefelter', label: 'Klinefelter Syndrome' },
  { id: 'phenylketonuria', label: 'Phenylketonuria (PKU)' },
  { id: 'neurofibromatosis', label: 'Neurofibromatosis' },
];

// Sensory/Developmental Conditions
const sensoryConditions = [
  { id: 'vision_impairment', label: 'Vision Impairment' },
  { id: 'hearing_impairment', label: 'Hearing Impairment' },
  { id: 'blindness', label: 'Blindness' },
  { id: 'deafness', label: 'Deafness' },
  { id: 'autism', label: 'Autism Spectrum Disorder' },
  { id: 'intellectual_disability', label: 'Intellectual Disability' },
  { id: 'learning_disability', label: 'Learning Disability' },
  { id: 'speech_disorder', label: 'Speech Disorder' },
  { id: 'sensory_processing', label: 'Sensory Processing Disorder' },
  { id: 'dyslexia', label: 'Dyslexia' },
  { id: 'dyscalculia', label: 'Dyscalculia' },
];

const otherConditions = [
  { id: 'chronic_fatigue', label: 'Chronic Fatigue Syndrome' },
  { id: 'chronic_pain', label: 'Chronic Pain Syndrome' },
  { id: 'fibromyalgia', label: 'Fibromyalgia' },
  { id: 'amputation', label: 'Amputation' },
  { id: 'long_covid', label: 'Long COVID' },
  { id: 'mast_cell', label: 'Mast Cell Activation Syndrome' },
  { id: 'dysautonomia', label: 'Dysautonomia/POTS' },
  { id: 'chronic_lyme', label: 'Chronic Lyme Disease' },
  { id: 'chemical_sensitivity', label: 'Multiple Chemical Sensitivity' },
  { id: 'electromagnetic_sensitivity', label: 'Electromagnetic Hypersensitivity' },
];

// Combine all health conditions for use in the component
const healthConditions = [
  ...cardiovascularConditions,
  ...respiratoryConditions,
  ...metabolicConditions,
  ...musculoskeletalConditions,
  ...neurologicalConditions,
  ...mentalHealthConditions,
  ...digestiveConditions,
  ...immuneConditions,
  ...bloodDisorders,
  ...skinConditions,
  ...urinaryConditions,
  ...reproductiveConditions,
  ...geneticConditions,
  ...sensoryConditions,
  ...otherConditions,
];

// Comprehensive list of allergies
const medicationAllergies = [
  { id: 'nsaids', label: 'NSAIDs (Aspirin, Ibuprofen)' },
  { id: 'antibiotics', label: 'Antibiotics' },
  { id: 'penicillin', label: 'Penicillin' },
  { id: 'sulfa_drugs', label: 'Sulfa Drugs' },
  { id: 'opioids', label: 'Opioids' },
  { id: 'local_anesthetics', label: 'Local Anesthetics' },
  { id: 'contrast_dye', label: 'Contrast Dye' },
  { id: 'ace_inhibitors', label: 'ACE Inhibitors' },
  { id: 'statins', label: 'Statins' },
  { id: 'insulin', label: 'Insulin' },
];

const foodAllergies = [
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree_nuts', label: 'Tree Nuts' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'fish', label: 'Fish' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'soy', label: 'Soy' },
  { id: 'corn', label: 'Corn' },
  { id: 'sesame', label: 'Sesame' },
  { id: 'sulfites', label: 'Sulfites' },
  { id: 'nightshades', label: 'Nightshades (Tomatoes, Peppers, etc.)' },
  { id: 'citrus', label: 'Citrus Fruits' },
  { id: 'berries', label: 'Berries' },
];

const environmentalAllergies = [
  { id: 'latex', label: 'Latex' },
  { id: 'pollen', label: 'Pollen' },
  { id: 'dust_mites', label: 'Dust Mites' },
  { id: 'mold', label: 'Mold' },
  { id: 'pet_dander', label: 'Pet Dander' },
  { id: 'insect_stings', label: 'Insect Stings' },
  { id: 'nickel', label: 'Nickel' },
  { id: 'fragrances', label: 'Fragrances' },
  { id: 'cleaning_products', label: 'Cleaning Products' },
  { id: 'adhesives', label: 'Adhesives' },
];

// Combine all allergies for use in the component
const commonAllergies = [
  ...medicationAllergies,
  ...foodAllergies,
  ...environmentalAllergies,
];

// Comprehensive list of injuries organized by body region
const kneeInjuries = [
  { id: 'acl', label: 'ACL Tear/Reconstruction' },
  { id: 'pcl', label: 'PCL Tear/Injury' },
  { id: 'mcl', label: 'MCL Sprain/Tear' },
  { id: 'lcl', label: 'LCL Sprain/Tear' },
  { id: 'meniscus', label: 'Meniscus Tear' },
  { id: 'patellar_tendonitis', label: 'Patellar Tendonitis (Jumper\'s Knee)' },
  { id: 'patellofemoral', label: 'Patellofemoral Pain Syndrome' },
  { id: 'knee_replacement', label: 'Knee Replacement' },
  { id: 'knee_arthroscopy', label: 'Knee Arthroscopy' },
  { id: 'knee_dislocation', label: 'Knee Dislocation' },
];

const shoulderInjuries = [
  { id: 'rotator_cuff', label: 'Rotator Cuff Tear/Injury' },
  { id: 'shoulder_impingement', label: 'Shoulder Impingement' },
  { id: 'frozen_shoulder', label: 'Frozen Shoulder (Adhesive Capsulitis)' },
  { id: 'shoulder_dislocation', label: 'Shoulder Dislocation/Instability' },
  { id: 'labral_tear', label: 'Labral Tear (SLAP Lesion)' },
  { id: 'ac_joint', label: 'AC Joint Separation' },
  { id: 'shoulder_bursitis', label: 'Shoulder Bursitis' },
  { id: 'shoulder_replacement', label: 'Shoulder Replacement' },
];

const ankleFootInjuries = [
  { id: 'ankle_sprain', label: 'Ankle Sprain' },
  { id: 'achilles_tendonitis', label: 'Achilles Tendonitis' },
  { id: 'achilles_rupture', label: 'Achilles Tendon Rupture' },
  { id: 'plantar', label: 'Plantar Fasciitis' },
  { id: 'ankle_fracture', label: 'Ankle Fracture' },
  { id: 'stress_fracture_foot', label: 'Stress Fracture (Foot)' },
  { id: 'bunions', label: 'Bunions' },
  { id: 'morton_neuroma', label: 'Morton\'s Neuroma' },
  { id: 'flat_feet', label: 'Flat Feet (Fallen Arches)' },
  { id: 'high_arches', label: 'High Arches (Pes Cavus)' },
];

const backInjuries = [
  { id: 'herniated_disc', label: 'Herniated Disc' },
  { id: 'bulging_disc', label: 'Bulging Disc' },
  { id: 'spinal_stenosis', label: 'Spinal Stenosis' },
  { id: 'spondylolisthesis', label: 'Spondylolisthesis' },
  { id: 'compression_fracture', label: 'Vertebral Compression Fracture' },
  { id: 'sciatica', label: 'Sciatica' },
  { id: 'piriformis_syndrome', label: 'Piriformis Syndrome' },
  { id: 'spinal_fusion', label: 'Spinal Fusion Surgery' },
  { id: 'laminectomy', label: 'Laminectomy' },
  { id: 'discectomy', label: 'Discectomy' },
];

const hipInjuries = [
  { id: 'hip_labral_tear', label: 'Hip Labral Tear' },
  { id: 'hip_impingement', label: 'Hip Impingement (FAI)' },
  { id: 'hip_bursitis', label: 'Hip Bursitis' },
  { id: 'hip_flexor_strain', label: 'Hip Flexor Strain' },
  { id: 'it_band_syndrome', label: 'IT Band Syndrome' },
  { id: 'hip_replacement', label: 'Hip Replacement' },
  { id: 'hip_fracture', label: 'Hip Fracture' },
  { id: 'groin_strain', label: 'Groin Strain' },
  { id: 'si_joint_dysfunction', label: 'SI Joint Dysfunction' },
];

const elbowWristHandInjuries = [
  { id: 'tennis_elbow', label: 'Tennis Elbow (Lateral Epicondylitis)' },
  { id: 'golfers_elbow', label: 'Golfer\'s Elbow (Medial Epicondylitis)' },
  { id: 'carpal_tunnel', label: 'Carpal Tunnel Syndrome' },
  { id: 'wrist_tendonitis', label: 'Wrist Tendonitis' },
  { id: 'wrist_fracture', label: 'Wrist Fracture' },
  { id: 'finger_fracture', label: 'Finger Fracture' },
  { id: 'thumb_sprain', label: 'Thumb Sprain (Skier\'s Thumb)' },
  { id: 'trigger_finger', label: 'Trigger Finger' },
  { id: 'dupuytren_contracture', label: 'Dupuytren\'s Contracture' },
];

const legInjuries = [
  { id: 'hamstring_strain', label: 'Hamstring Strain' },
  { id: 'quad_strain', label: 'Quadriceps Strain' },
  { id: 'calf_strain', label: 'Calf Strain/Tear' },
  { id: 'shin_splints', label: 'Shin Splints' },
  { id: 'stress_fracture_leg', label: 'Stress Fracture (Leg)' },
  { id: 'compartment_syndrome', label: 'Compartment Syndrome' },
  { id: 'dvt', label: 'Deep Vein Thrombosis (DVT)' },
];

const otherInjuries = [
  { id: 'concussion', label: 'Concussion/TBI' },
  { id: 'whiplash', label: 'Whiplash' },
  { id: 'rib_fracture', label: 'Rib Fracture' },
  { id: 'diastasis_recti', label: 'Diastasis Recti' },
  { id: 'hernia', label: 'Hernia (Inguinal, Umbilical, etc.)' },
  { id: 'nerve_impingement', label: 'Nerve Impingement/Entrapment' },
  { id: 'post_surgical', label: 'Post-Surgical Recovery' },
  { id: 'amputation', label: 'Amputation' },
];

// Combine all injuries for use in the component
const commonInjuries = [
  ...kneeInjuries,
  ...shoulderInjuries,
  ...ankleFootInjuries,
  ...backInjuries,
  ...hipInjuries,
  ...elbowWristHandInjuries,
  ...legInjuries,
  ...otherInjuries,
];

const MedicalStatusStep = () => {
  const navigate = useNavigate();
  const {
    userType,
    medicalStatus,
    setMedicalStatus
  } = usePlan();

  // Initialize medical status state
  const [medicalInfo, setMedicalInfo] = useState({
    healthConditions: medicalStatus?.healthConditions || [],
    otherConditions: medicalStatus?.otherConditions || '',
    medications: medicalStatus?.medications || '',
    allergies: medicalStatus?.allergies || [],
    otherAllergies: medicalStatus?.otherAllergies || '',
    injuries: medicalStatus?.injuries || [],
    otherInjuries: medicalStatus?.otherInjuries || '',
    medicalClearance: medicalStatus?.medicalClearance || null,
    additionalNotes: medicalStatus?.additionalNotes || '',
  });

  // Handle checkbox changes for health conditions
  const toggleHealthCondition = (conditionId: string) => {
    setMedicalInfo(prev => {
      const isSelected = prev.healthConditions.includes(conditionId);
      return {
        ...prev,
        healthConditions: isSelected
          ? prev.healthConditions.filter(id => id !== conditionId)
          : [...prev.healthConditions, conditionId]
      };
    });
  };

  // Handle checkbox changes for allergies
  const toggleAllergy = (allergyId: string) => {
    setMedicalInfo(prev => {
      const isSelected = prev.allergies.includes(allergyId);
      return {
        ...prev,
        allergies: isSelected
          ? prev.allergies.filter(id => id !== allergyId)
          : [...prev.allergies, allergyId]
      };
    });
  };

  // Handle checkbox changes for injuries
  const toggleInjury = (injuryId: string) => {
    setMedicalInfo(prev => {
      const isSelected = prev.injuries.includes(injuryId);
      return {
        ...prev,
        injuries: isSelected
          ? prev.injuries.filter(id => id !== injuryId)
          : [...prev.injuries, injuryId]
      };
    });
  };

  // Handle navigation
  const handleBack = () => {
    // Navigate back to the appropriate step based on user type
    if (userType === 'athlete') {
      navigate('/onboarding/time-and-equipment');
    } else if (userType === 'individual') {
      navigate('/onboarding/individual/fitness-history');
    } else {
      navigate('/onboarding');
    }
  };

  const handleContinue = () => {
    // Save medical information to context
    setMedicalStatus(medicalInfo);

    // Navigate to the next step based on user type
    if (userType === 'athlete') {
      navigate('/onboarding/plan-generation');
    } else if (userType === 'individual') {
      navigate('/onboarding/individual/wellness-goals');
    } else {
      navigate('/onboarding/coach/team-setup');
    }
  };

  return (
    <OnboardingLayout
      step={userType === 'athlete' ? 5 : 3}
      totalSteps={userType === 'athlete' ? 7 : 5}
      title="Medical Status & Health Information"
    >
      <div className="space-y-6 mb-8">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-start">
            <Heart className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-700 mb-1">Why This Matters</h3>
              <p className="text-sm text-gray-600">
                Your health information helps us create a safe training program tailored to your specific needs.
                All information is kept private and used only to customize your experience.
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="conditions" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="conditions">Health Conditions</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="allergies">Allergies</TabsTrigger>
            <TabsTrigger value="injuries">Injuries</TabsTrigger>
          </TabsList>

          {/* Health Conditions Tab */}
          <TabsContent value="conditions" className="space-y-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-medium">Health Conditions</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select any health conditions you have that might affect your training.
            </p>

            {/* Cardiovascular Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-red-50 text-red-800 px-3 py-2 rounded-md mb-3">
                Cardiovascular Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {cardiovascularConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Respiratory Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-blue-50 text-blue-800 px-3 py-2 rounded-md mb-3">
                Respiratory Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {respiratoryConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Metabolic Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-green-50 text-green-800 px-3 py-2 rounded-md mb-3">
                Metabolic & Endocrine Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {metabolicConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Musculoskeletal Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-orange-50 text-orange-800 px-3 py-2 rounded-md mb-3">
                Musculoskeletal Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {musculoskeletalConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Neurological Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-purple-50 text-purple-800 px-3 py-2 rounded-md mb-3">
                Neurological Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {neurologicalConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Mental Health Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-indigo-50 text-indigo-800 px-3 py-2 rounded-md mb-3">
                Mental Health Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {mentalHealthConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Digestive Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-yellow-50 text-yellow-800 px-3 py-2 rounded-md mb-3">
                Digestive Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {digestiveConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Immune Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-teal-50 text-teal-800 px-3 py-2 rounded-md mb-3">
                Immune & Cancer-Related Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {immuneConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Blood Disorders */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-rose-50 text-rose-800 px-3 py-2 rounded-md mb-3">
                Blood Disorders
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {bloodDisorders.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Skin Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-amber-50 text-amber-800 px-3 py-2 rounded-md mb-3">
                Skin Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {skinConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Urinary/Renal Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-cyan-50 text-cyan-800 px-3 py-2 rounded-md mb-3">
                Urinary & Kidney Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {urinaryConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Reproductive/Hormonal Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-pink-50 text-pink-800 px-3 py-2 rounded-md mb-3">
                Reproductive & Hormonal Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {reproductiveConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Genetic/Rare Disorders */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-violet-50 text-violet-800 px-3 py-2 rounded-md mb-3">
                Genetic & Rare Disorders
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {geneticConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensory/Developmental Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-lime-50 text-lime-800 px-3 py-2 rounded-md mb-3">
                Sensory & Developmental Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {sensoryConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Conditions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-gray-50 text-gray-800 px-3 py-2 rounded-md mb-3">
                Other Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {otherConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={medicalInfo.healthConditions.includes(condition.id)}
                      onCheckedChange={() => toggleHealthCondition(condition.id)}
                    />
                    <Label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="otherConditions">Additional Health Conditions</Label>
              <Textarea
                id="otherConditions"
                placeholder="List any other health conditions not mentioned above..."
                value={medicalInfo.otherConditions}
                onChange={(e) => setMedicalInfo({...medicalInfo, otherConditions: e.target.value})}
              />
            </div>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-4">
            <div className="flex items-center mb-2">
              <Pill className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">Current Medications</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              List any medications you're currently taking that might affect your training or nutrition.
            </p>

            <div className="space-y-2">
              <Textarea
                id="medications"
                placeholder="List medications, supplements, or other substances you take regularly..."
                value={medicalInfo.medications}
                onChange={(e) => setMedicalInfo({...medicalInfo, medications: e.target.value})}
                className="min-h-[150px]"
              />
            </div>
          </TabsContent>

          {/* Allergies Tab */}
          <TabsContent value="allergies" className="space-y-4">
            <div className="flex items-center mb-2">
              <Activity className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium">Allergies</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select any allergies that might affect your training or nutrition plan.
            </p>

            {/* Medication Allergies */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-red-50 text-red-800 px-3 py-2 rounded-md mb-3">
                Medication Allergies
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {medicationAllergies.map((allergy) => (
                  <div key={allergy.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`allergy-${allergy.id}`}
                      checked={medicalInfo.allergies.includes(allergy.id)}
                      onCheckedChange={() => toggleAllergy(allergy.id)}
                    />
                    <Label
                      htmlFor={`allergy-${allergy.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {allergy.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Allergies */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-green-50 text-green-800 px-3 py-2 rounded-md mb-3">
                Food Allergies
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {foodAllergies.map((allergy) => (
                  <div key={allergy.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`allergy-${allergy.id}`}
                      checked={medicalInfo.allergies.includes(allergy.id)}
                      onCheckedChange={() => toggleAllergy(allergy.id)}
                    />
                    <Label
                      htmlFor={`allergy-${allergy.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {allergy.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Allergies */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-blue-50 text-blue-800 px-3 py-2 rounded-md mb-3">
                Environmental Allergies
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {environmentalAllergies.map((allergy) => (
                  <div key={allergy.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`allergy-${allergy.id}`}
                      checked={medicalInfo.allergies.includes(allergy.id)}
                      onCheckedChange={() => toggleAllergy(allergy.id)}
                    />
                    <Label
                      htmlFor={`allergy-${allergy.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {allergy.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="otherAllergies">Other Allergies</Label>
              <Textarea
                id="otherAllergies"
                placeholder="List any other allergies not mentioned above..."
                value={medicalInfo.otherAllergies}
                onChange={(e) => setMedicalInfo({...medicalInfo, otherAllergies: e.target.value})}
              />
            </div>
          </TabsContent>

          {/* Injuries Tab */}
          <TabsContent value="injuries" className="space-y-4">
            <div className="flex items-center mb-2">
              <Bandage className="h-5 w-5 text-orange-500 mr-2" />
              <h3 className="font-medium">Previous Injuries</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select any previous or current injuries that might affect your training.
            </p>

            {/* Knee Injuries */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-red-50 text-red-800 px-3 py-2 rounded-md mb-3">
                Knee Injuries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {kneeInjuries.map((injury) => (
                  <div key={injury.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`injury-${injury.id}`}
                      checked={medicalInfo.injuries.includes(injury.id)}
                      onCheckedChange={() => toggleInjury(injury.id)}
                    />
                    <Label
                      htmlFor={`injury-${injury.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {injury.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Shoulder Injuries */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-blue-50 text-blue-800 px-3 py-2 rounded-md mb-3">
                Shoulder Injuries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {shoulderInjuries.map((injury) => (
                  <div key={injury.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`injury-${injury.id}`}
                      checked={medicalInfo.injuries.includes(injury.id)}
                      onCheckedChange={() => toggleInjury(injury.id)}
                    />
                    <Label
                      htmlFor={`injury-${injury.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {injury.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Ankle & Foot Injuries */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-green-50 text-green-800 px-3 py-2 rounded-md mb-3">
                Ankle & Foot Injuries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {ankleFootInjuries.map((injury) => (
                  <div key={injury.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`injury-${injury.id}`}
                      checked={medicalInfo.injuries.includes(injury.id)}
                      onCheckedChange={() => toggleInjury(injury.id)}
                    />
                    <Label
                      htmlFor={`injury-${injury.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {injury.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Injuries */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-yellow-50 text-yellow-800 px-3 py-2 rounded-md mb-3">
                Back & Spine Injuries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {backInjuries.map((injury) => (
                  <div key={injury.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`injury-${injury.id}`}
                      checked={medicalInfo.injuries.includes(injury.id)}
                      onCheckedChange={() => toggleInjury(injury.id)}
                    />
                    <Label
                      htmlFor={`injury-${injury.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {injury.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Hip Injuries */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-purple-50 text-purple-800 px-3 py-2 rounded-md mb-3">
                Hip & Pelvis Injuries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {hipInjuries.map((injury) => (
                  <div key={injury.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`injury-${injury.id}`}
                      checked={medicalInfo.injuries.includes(injury.id)}
                      onCheckedChange={() => toggleInjury(injury.id)}
                    />
                    <Label
                      htmlFor={`injury-${injury.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {injury.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Elbow, Wrist & Hand Injuries */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-orange-50 text-orange-800 px-3 py-2 rounded-md mb-3">
                Elbow, Wrist & Hand Injuries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {elbowWristHandInjuries.map((injury) => (
                  <div key={injury.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`injury-${injury.id}`}
                      checked={medicalInfo.injuries.includes(injury.id)}
                      onCheckedChange={() => toggleInjury(injury.id)}
                    />
                    <Label
                      htmlFor={`injury-${injury.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {injury.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Leg Injuries */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-indigo-50 text-indigo-800 px-3 py-2 rounded-md mb-3">
                Leg Injuries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {legInjuries.map((injury) => (
                  <div key={injury.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`injury-${injury.id}`}
                      checked={medicalInfo.injuries.includes(injury.id)}
                      onCheckedChange={() => toggleInjury(injury.id)}
                    />
                    <Label
                      htmlFor={`injury-${injury.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {injury.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Injuries */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold bg-gray-50 text-gray-800 px-3 py-2 rounded-md mb-3">
                Other Injuries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {otherInjuries.map((injury) => (
                  <div key={injury.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`injury-${injury.id}`}
                      checked={medicalInfo.injuries.includes(injury.id)}
                      onCheckedChange={() => toggleInjury(injury.id)}
                    />
                    <Label
                      htmlFor={`injury-${injury.id}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {injury.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="otherInjuries">Additional Injuries</Label>
              <Textarea
                id="otherInjuries"
                placeholder="Describe any other injuries not listed above..."
                value={medicalInfo.otherInjuries}
                onChange={(e) => setMedicalInfo({...medicalInfo, otherInjuries: e.target.value})}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <Label className="font-medium">Medical Clearance</Label>
            <p className="text-sm text-gray-600 mb-2">
              Have you received medical clearance for physical activity?
            </p>
            <RadioGroup
              value={medicalInfo.medicalClearance || ''}
              onValueChange={(value) => setMedicalInfo({...medicalInfo, medicalClearance: value})}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="clearance-yes" />
                <Label htmlFor="clearance-yes">Yes, I have medical clearance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="clearance-no" />
                <Label htmlFor="clearance-no">No, I don't have medical clearance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_needed" id="clearance-not-needed" />
                <Label htmlFor="clearance-not-needed">Not needed for my situation</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any other health information you'd like us to know..."
              value={medicalInfo.additionalNotes}
              onChange={(e) => setMedicalInfo({...medicalInfo, additionalNotes: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-athleteBlue-600 hover:bg-athleteBlue-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default MedicalStatusStep;
