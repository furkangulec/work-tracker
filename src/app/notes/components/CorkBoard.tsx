interface CorkBoardProps {
  children: React.ReactNode;
}

export function CorkBoard({ children }: CorkBoardProps) {
  return (
    <div className="h-screen overflow-hidden" style={{
      background: `
        repeating-linear-gradient(
          45deg,
          rgb(191, 129, 82),
          rgb(191, 129, 82) 2px,
          rgb(186, 124, 77) 2px,
          rgb(186, 124, 77) 4px
        ),
        repeating-linear-gradient(
          -45deg,
          rgb(191, 129, 82),
          rgb(191, 129, 82) 2px,
          rgb(186, 124, 77) 2px,
          rgb(186, 124, 77) 4px
        ),
        linear-gradient(
          to bottom,
          rgb(181, 119, 72),
          rgb(181, 119, 72)
        )
      `,
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.2)'
    }}>
      {/* Cork board texture overlay */}
      <div 
        className="fixed inset-0 bg-repeat opacity-50 mix-blend-overlay pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='25' cy='25' r='1' /%3E%3Ccircle cx='75' cy='25' r='1' /%3E%3Ccircle cx='25' cy='75' r='1' /%3E%3Ccircle cx='75' cy='75' r='1' /%3E%3Ccircle cx='50' cy='50' r='1' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px'
        }}
      />
      {children}
    </div>
  );
} 