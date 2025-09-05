import NavigationButton from '@/components/ui/NavigationButton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as fs from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';

const AnalyzeScreen = () => {
  const [analysisResult, setAnalysisResult] = useState<string>('')
  const { media } = useLocalSearchParams()
  const router = useRouter()


  const sendToAI = async (encodedPhoto: string): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey as string,
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [
              { text: 'Describe this image in one concise paragraph containing 30 words or fewer' },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: encodedPhoto
                },
              },
            ],
          }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini ${res.status}: ${errText}`);
    }

    const json = await res.json();

    const text =
      json?.candidates[0].content?.parts[0].text
    return text;

  }

  const getPhotoAnalysis = async () => {
    try {
      const encodedPhoto = await fs.readAsStringAsync(`file://${media}`, { encoding: 'base64' })

      const aiResponse = await sendToAI(encodedPhoto)
      setAnalysisResult(aiResponse)

    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (!media) return

    getPhotoAnalysis()

  }, [media])

  return (
    <SafeAreaView className='flex-1 bg-slate-900'>
      <View className='h-full p-4'>
        <View className='relative h-[75%] rounded-2xl overflow-hidden'>
          <Image
            source={{ uri: `file://${media}` }}
            className='w-full h-full'
            accessibilityRole="image"
            accessibilityLabel="Captured photo"
          />
        </View>
        <View className='flex-col flex-1 mt-6'>
          {analysisResult ?
            (
              <View className='flex-col justify-start w-full '>
                <Text className='text-2xl font-bold text-white'>AI Analysis:</Text>
                <Text className='font-bold text-accent text-md'>{analysisResult}</Text>
              </View>
            ) :
            (
              <View className='flex items-center justify-center flex-1'>
                <MaterialCommunityIcons
                  name="loading"
                  size={96}
                  color="#6b1bf5"
                  className='animate-spin'
                  testID="loading-icon"
                  accessibilityRole="image"
                  accessibilityLabel="Loading analysis"
                />
              </View>
            )}
        </View>
        <NavigationButton
          text='Back to Camera'
          onPress={() => router.back()}
          disabled={!!!analysisResult}
        />
      </View>
    </SafeAreaView>
  )
}

export default AnalyzeScreen
