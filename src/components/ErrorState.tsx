export default function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="helper">
      {message || 'Algo deu errado.'}
      {onRetry && (
        <div style={{ marginTop: 8 }}>
          <button className="btn" onClick={onRetry}>Tentar novamente</button>
        </div>
      )}
    </div>
  );
}
