// 효과음 연결 지점. 지금은 소리를 내지 않는다.
// 나중에 public/sounds/*.mp3 를 추가하고 아래 함수에서 new Audio(...).play() 를 호출하면 된다.
export type FortuneSoundEvent = 'shake' | 'stick' | 'unfold' | 'great' | 'bad';

export function playFortuneSound(event: FortuneSoundEvent) {
  void event;
}
