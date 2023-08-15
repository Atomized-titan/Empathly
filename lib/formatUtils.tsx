export const formatTextWithMentions = (text: string) => {
  const words = text.split(/\s+/); // Split text into words
  const formattedWords = words.map((word, index) => {
    if (word.startsWith('@')) {
      const twitterHandle = word.substring(1); // Remove "@" symbol
      const twitterLink = `https://twitter.com/${twitterHandle}`;
      return (
        <a
          key={index}
          href={twitterLink}
          target='_blank'
          rel='noopener noreferrer'
        >
          <span className='!text-blue hover:underline'>{word}</span>
        </a>
      );
    }
    return <span key={index}>{word} </span>;
  });
  return formattedWords;
};
