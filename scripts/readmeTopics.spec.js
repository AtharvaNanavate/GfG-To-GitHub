describe('appendProblemToGFGReadme', () => {
  it('should correctly append to previous GFG readme which has start and end tags', () => {
    const sampleText = '# GeeksforGeeks Topics\n### Extra Hard questions\nThese are notes I want for extra hard problems\n\n# About me\nThis a repo I had that I wished to do xyz with\n\n<!---GFG Topics Start-->\n# GeeksforGeeks Topics\n\n## Arrays\n|  |\n| ------- |\n| [0020-fake-problem](https://www.geeksforgeeks.org/0020-fake-problem/) |\n\n<!---GFG Topics End-->'
    const output = appendProblemToGFGReadme('Arrays', sampleText, '0013-roman-to-integer');
    const expected = '# GeeksforGeeks Topics\n### Extra Hard questions\nThese are notes I want for extra hard problems\n\n# About me\nThis a repo I had that I wished to do xyz with\n\n<!---GFG Topics Start-->\n# GeeksforGeeks Topics\n\n## Arrays\n|  |\n| ------- |\n| [0020-fake-problem](https://www.geeksforgeeks.org/0020-fake-problem/) |\n| [0013-roman-to-integer](https://www.geeksforgeeks.org/0013-roman-to-integer/) |\n\n<!---GFG Topics End-->'
    expect(output).toBe(expected)
  })

  it('should not append duplicate problem', () => {
    const sampleText = '# GeeksforGeeks Topics\n### Extra Hard questions\nThese are notes I want for extra hard problems\n\n# About me\nThis a repo I had that I wished to do xyz with\n\n<!---GFG Topics Start-->\n# GeeksforGeeks Topics\n\n## Arrays\n|  |\n| ------- |\n| [0013-roman-to-integer](https://www.geeksforgeeks.org/0013-roman-to-integer/) |\n| [0020-fake-problem](https://www.geeksforgeeks.org/0020-fake-problem/) |\n\n<!---GFG Topics End-->'
    const output = appendProblemToGFGReadme('Arrays', sampleText, '0013-roman-to-integer');
    const expected = '# GeeksforGeeks Topics\n### Extra Hard questions\nThese are notes I want for extra hard problems\n\n# About me\nThis a repo I had that I wished to do xyz with\n\n<!---GFG Topics Start-->\n# GeeksforGeeks Topics\n\n## Arrays\n|  |\n| ------- |\n| [0013-roman-to-integer](https://www.geeksforgeeks.org/0013-roman-to-integer/) |\n| [0020-fake-problem](https://www.geeksforgeeks.org/0020-fake-problem/) |\n\n<!---GFG Topics End-->'
    expect(output).toBe(expected)
  })
})

// describe('sortGFGTopicsInReadme', () => {
//   it('should correctly sort previous GFG readme which has start and end tags', () => {
//     const sampleText = '# GeeksforGeeks Topics\n### Extra Hard questions\nThese are notes I want for extra hard problems\n\n# About me\nThis a repo I had that I wished to do xyz with\n\n<!---GFG Topics Start-->\n# GeeksforGeeks Topics\n\n## Arrays\n|  |\n| ------- |\n| [0020-fake-problem](https://www.geeksforgeeks.org/0020-fake-problem/) |\n| [0012-fake-problem](https://www.geeksforgeeks.org/0012-fake-problem/) |\n| [0009-fake-problem](https://www.geeksforgeeks.org/0009-fake-problem/) |\n| [0013-roman-to-integer](https://www.geeksforgeeks.org/0013-roman-to-integer/) |\n| [0020-fake-problem](https://www.geeksforgeeks.org/0020-fake-problem/) |\n| [0090-fake-problem](https://www.geeksforgeeks.org/0090-fake-problem/) |\n\n<!---GFG Topics End-->'
//     const output = sortGFGTopicsInReadme(appendProblemToGFGReadme('Arrays', sampleText, '0013-roman-to-integer'));
//     const expected = '# GeeksforGeeks Topics\n### Extra Hard
