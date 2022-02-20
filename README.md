# Character-Animation-Merge-tool

人物模型动画合并工具

依赖：Three.js

## 使用说明

`AnimationTool`类的构造函数需提供两个参数：原GLTF文件（即示例中的坐姿文件），需替换动画骨骼的索引（即示例中的脊椎，盆骨，以及所有下肢骨骼的索引）。此GLTF文件中的动画为初始动画，即类属性`animations[0]`。

`AnimationTool.mergeAnimation()`方法用来合并动画，参数为一个GLTF文件，使其动画与原GLTF文件动画合并（示例中此函数参数为站姿鼓掌模型文件）。合并后的动画数据添加到类属性`animations`中。

`AnimationTool.addAnimation()`方法用来直接添加一个动画至类属性`animations`中。

`AnimationTool.playAnimation()`方法用来播放一个`animations`中的动画，参数一为一个`THREE.AnimationMixer`对象（详见Three.js），参数二为所要播放动画的序号。

`AnimationTool.getAnimation()`方法用于返回所有生成的动画，即`animations`。

## 示例

人物坐姿模型

![image-20220220195109518](img\sit.png)

人物站姿鼓掌模型

![image-20220220195239579](img\clap.png)

合并后：坐姿鼓掌

![image-20220220195350012](img\sit-clap.png)
