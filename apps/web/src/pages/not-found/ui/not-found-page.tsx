import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <main
      style={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <section>
        <p style={{ margin: 0, color: '#a5b4fc' }}>404</p>
        <h1>페이지를 찾을 수 없습니다.</h1>
        <Link to="/">홈으로 돌아가기</Link>
      </section>
    </main>
  );
}
