import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './markdown.module.css'

const MarkdownRenderer = ({ content }) => {
  return (
    <div>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className={styles.h1} {...props} />,
            h2: ({ node, ...props }) => <h2 className={styles.h1} style={{"fontSize":"1.125rem"}} {...props} />,
            h3: ({ node, ...props }) => <h3 className={styles.h3} {...props} />,
            h4: ({ node, ...props }) => <h4 className={styles.h4} {...props} />,
            p: ({ node, ...props }) => <p className={styles.p} {...props} />,
            a: ({ node, ...props }) => <a className={styles.a} {...props} />,
            ul: ({ node, ...props }) => <ul className={styles.ul} {...props} />,
            ol: ({ node, ...props }) => <ol className={styles.ul} style={{"listStyleType":"decimal"}} {...props} />,
            li: ({ node, ...props }) => <li style={{"marginBottom":"0.25rem"}} {...props} />,
            strong: ({ node, ...props }) => <strong style={{"fontWeight":"600"}} {...props} />,
            em: ({ node, ...props }) => <em style={{"fontstyle":"italic"}} {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className='' {...props} />,
            code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                    <SyntaxHighlighter
                      style={dracula}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                ) : (
                    <code {...props} >
                        {children}
                    </code>
                )
            },
            pre: ({ node, ...props }) => <pre  {...props} />,
          }}
        >
            {content}
        </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer