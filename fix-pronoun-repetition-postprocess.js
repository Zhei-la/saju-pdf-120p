const fs = require('fs');

const file = 'services/aiGenerator.js';
let s = fs.readFileSync(file, 'utf8');

const target = `content = content
        .replace(/결론적으로,?/g, '')
        .replace(/AI/g, '')
        .replace(/자동 생성/g, '')
        .replace(/\\n{3,}/g, '\\n\\n')
        .trim();`;

const patch = `content = content
        .replace(/결론적으로,?/g, '')
        .replace(/AI/g, '')
        .replace(/자동 생성/g, '')

        // 고객을 제3자처럼 부르는 표현 제거
        .replace(/그녀에게는/g, '김가영 님에게는')
        .replace(/그녀는/g, '김가영 님은')
        .replace(/그녀의/g, '김가영 님의')
        .replace(/그녀가/g, '김가영 님이')
        .replace(/그녀를/g, '김가영 님을')
        .replace(/그녀와/g, '김가영 님과')
        .replace(/그녀에게/g, '김가영 님에게')
        .replace(/그녀/g, '김가영 님')

        // 용어해설 반복 제거
        .replace(/\\[용어 해설\\][\\s\\S]*$/g, '')

        // 반복되는 사주 용어 완화
        .replace(/갑목\\(甲木\\)/g, '타고난 성장 기질')
        .replace(/갑목/g, '성장 기질')
        .replace(/신약한 사주/g, '예민하게 반응하는 흐름')
        .replace(/신약한/g, '예민한')
        .replace(/수 기운이 부족/g, '감정 정리가 늦어질 수 있음')
        .replace(/수 기운의 부족/g, '감정 정리가 늦어지는 흐름')
        .replace(/오행 분포/g, '전체 흐름')
        .replace(/사주 원국/g, '기본 흐름')

        // 어색한 변환 보정
        .replace(/호흡로운/g, '조화로운')
        .replace(/불흐름/g, '불안정한 흐름')
        .replace(/예민한 성향로/g, '예민한 성향으로')

        .replace(/\\n{3,}/g, '\\n\\n')
        .trim();`;

if (s.includes(target)) {
  s = s.replace(target, patch);
} else {
  console.log('target not found');
}

fs.writeFileSync(file, s, 'utf8');
console.log('pronoun and repetition postprocess fixed');
