import { useEffect, useState, type FC } from 'react';
import styles from './header.module.css';
import { useAddTodoMutation } from '../../services/todoApi';

const Header: FC = () => {
  const [text, setText] = useState('');
  const [addTodo, { isLoading }] = useAddTodoMutation();
  const [buttonState, setButtonState] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );

  const handleAddClick = async () => {
    if (!text.trim()) return;

    try {
      await addTodo({ text: text.trim(), status: 'to do' }).unwrap();
      setText('');
      setButtonState('success');
    } catch (err) {
      console.error('Failed to add todo', err);
      setButtonState('error');
    }
  };

  useEffect(() => {
    if (buttonState !== 'idle') {
      const timer = setTimeout(() => setButtonState('idle'), 1500);
      return () => clearTimeout(timer);
    }
  }, [buttonState]);

  const getButtonContent = () => {
    if (isLoading)
      return <span className={styles.addSpinner} aria-label='Loading' />;
    if (buttonState === 'success') return '✓';
    if (buttonState === 'error') return '✕';
    return '＋';
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.logoButton}>
          <a href='/' className={styles.logoLink}>
            <img src='/images/logo.svg' alt='Logo' className={styles.logo} />
          </a>
        </button>

        <input
          type='text'
          className={styles.searchInput}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Add new task'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddClick();
            }
          }}
          disabled={isLoading}
        />

        <button
          className={`${styles.addButton} ${
            buttonState === 'success'
              ? styles.success
              : buttonState === 'error'
              ? styles.error
              : ''
          }`}
          onClick={handleAddClick}
          disabled={isLoading}
        >
          {getButtonContent()}
        </button>
      </div>

      <div className={styles.rightSection}>
        <h1 className={styles.title}>Task Master</h1>
        <button className={styles.copyBtn}>
          <img src='/images/save.svg' alt='Logo' className={styles.saveIcon} />
        </button>
      </div>
    </header>
  );
};

export { Header };
