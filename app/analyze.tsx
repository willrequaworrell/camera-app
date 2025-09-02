import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as fs from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';

const AnalyzeScreen = () => {
  const [analysisResult, setAnalysisResult] = useState<string>('')
  const {media} = useLocalSearchParams()


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
              { text: 'Describe this image in one concise paragraph.' },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: encodedPhoto 
                },
              },
            ],
          }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
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
      const encodedPhoto = await fs.readAsStringAsync(`file://${media}`, {encoding: 'base64'})

      const aiResponse = await sendToAI(encodedPhoto)
      setAnalysisResult(aiResponse)

    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (!media) return 
    
    getPhotoAnalysis()

  } , [media])

  return (
    <SafeAreaView className='flex-1 bg-slate-900'>
      <View className='p-4 h-full'>
        <Image 
          source={{uri: `file://${media}`}}
          className='w-full h-[85%] rounded-2xl overflow-hidden '
        />
        <View className='flex justify-center items-center h-[15%]'>
          {analysisResult ? 
          (
            <View className='flex-col w-full justify-start'>
              <Text className='text-white text-2xl'>Analysis:</Text>
              <Text className='text-accent text-md'>{analysisResult}</Text>
            </View>
          ) : 
          (
            <MaterialCommunityIcons name="loading" size={72} color="#7E22CD" className='animate-spin' />
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AnalyzeScreen
