import * as THREE from './THREE/build/three.module.js';

class AnimationTool {

    constructor( baseMesh, baseAnimationClip, baseBoneIndices ) {

        // this.model = baseMesh.parent;
        this.baseMesh = baseMesh;
        this.animations = [];
        this.baseAnimationClip = baseAnimationClip;
        this.animations.push( baseAnimationClip );
        this.baseBoneIndices = baseBoneIndices;
        this.boneCount = this.baseAnimationClip.tracks.length / 3;
        this.animationMixer = new THREE.AnimationMixer( this.baseMesh );

        this.maxDuration = 4; // 动画最长持续时间(秒)

    }

    mergeAnimation( animation ) { // 将此动画中属于baseBone的部分替换为对应的baseAnimationClip

        let animationClip = animation.clone();
        let baseAnimationClip = this.baseAnimationClip.clone();

        animationClip.duration = Math.min( animationClip.duration, baseAnimationClip.duration );
        let tracksTemp = animationClip.tracks.map( ( value, index ) => {
            const BoneIndex = Math.floor( index / 3 );
            if ( this.baseBoneIndices.includes(BoneIndex) ) {
                return baseAnimationClip.tracks[index];
            }
            else return value;
        });
        animationClip.tracks = tracksTemp;

        animationClip.trim();

        this.animations.push( animationClip );

    }

    addAnimation( animation ) { // 将动画添加进来, 不做改变

        this.animations.push( animation );

    }

    playAnimation( animationIndex ) { // 播放合并后的某个动画
        
        this.animationMixer.stopAllAction();
        const action = this.animationMixer.clipAction( this.animations[animationIndex] );
        action.play();
        let interval = setInterval( () => {

            if (action._loopCount < 0)
                this.animationMixer.update(0.01);
            else 
                clearInterval(interval);

        }, 10);

    }

    getAnimations() { // 得到所有合并后的动画 

        for (let i = 0; i < this.animations.length; i++) {
            this.animations[i].duration = Math.min( this.maxDuration, this.animations[i].duration );
            this.animations[i].trim();
        }
        return this.animations;

    }

}

class AnimationJSONTool {

    constructor( baseMesh, animations ) {

        this.baseMesh = baseMesh;
        this.boneCount = this.baseMesh.skeleton.bones.length;
        this.animations = animations;
        this.animationMixer = new THREE.AnimationMixer( this.baseMesh );

        this.saveFrames = 20; // 保存动画JSON文件的总帧数

    }

    getAnimationJSON( animationIndex ) {

        return new Promise( (resolve, reject) => {

            this.animationMixer.stopAllAction();
            this.baseMesh.pose();
            this.animationMixer.clipAction( this.animations[animationIndex] ).play();

            const frameInterval = this.animations[animationIndex].duration / this.saveFrames;
            let frame = 0;
            let boneMatrices = [];

            let interval = setInterval( () => {

                if (frame < this.saveFrames) {
                    this.animationMixer.update( frameInterval );
                    frame++;
                    for(let i = 0; i < this.boneCount; i++)
                        for(let j = 0; j < 4; j++)
                            for(let k = 0; k < 3; k++)
                                boneMatrices.push( this.baseMesh.skeleton.boneMatrices[16 * i + 4 * j + k] );
                }
                else {
                    clearInterval(interval);
                    resolve({
                        config: [boneMatrices.length],
                        animation: [boneMatrices]
                    });
                }
                    
            }, frameInterval * 1000 );

        });

    }

    async getAllAnimationJSON() {

        let result = {
            config: [],
            animation: []
        };

        for (let i = 0; i < this.animations.length; i++) {

            let tempResult = await this.getAnimationJSON( i );

            result.config.push( ...(tempResult.config) );
            result.animation.push( ...(tempResult.animation) );

        }

        return result;

    }
}

export { AnimationTool, AnimationJSONTool };