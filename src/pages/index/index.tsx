import { View } from '@tarojs/components'
import { AtButton, AtCard } from 'taro-ui'

import './index.scss'

const Index = () => {
  return (
    <View className="index bg-red">
      <AtButton type="primary">123123</AtButton>
      <AtCard title="标题">
        正文2213xxx12313
      </AtCard>
    </View>
  )
}

export default Index
