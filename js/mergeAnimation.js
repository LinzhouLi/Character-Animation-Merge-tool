class AnimationTool {

    constructor(baseGLTF, baseBoneIndices) {

        this.animations = baseGLTF.animations;
        this.baseAnimationClip = baseGLTF.animations[0];
        this.baseBoneIndices = baseBoneIndices;
        this.boneCount = this.baseAnimationClip.tracks / 3;

    }

    mergeAnimation(GLTF) { // 将此动画中属于baseBone的部分替换为对应的baseAnimationClip

        let animationClip = GLTF.animations[0].clone();
        let baseAnimationClip = this.baseAnimationClip.clone();

        animationClip.duration = Math.min(animationClip.duration, baseAnimationClip.duration);

        let tracksTemp = animationClip.tracks.map( (value, index) => {
            const BoneIndex = Math.floor( index / 3 );
            if (this.baseBoneIndices.includes(BoneIndex)) {
                return baseAnimationClip.tracks[index];
            }
            else return value;
        });
        animationClip.tracks = tracksTemp;

        animationClip.trim();

        this.animations.push(animationClip);

    }

    addAnimation(GLTF) { // 将动画添加进来, 不做改变

        this.animations.push(GLTF.animations[0]);

    }

    playAnimation(animationMixer, animationIndex) { // 播放合并后某个动画

        animationMixer.stopAllAction();
        const action = animationMixer.clipAction( this.animations[animationIndex] );
        action.play();

    }

    getAnimations() { // 得到所有合并后的动画 

        return this.animations;

    }

}

export { AnimationTool };