interface Props {
  value: string;
  label: string;
}

const StatBadge = ({ value, label }: Props) => (
  <div className="text-center">
    <div className="text-2xl sm:text-3xl font-bold gradient-text" style={{ fontFamily: 'Syne, sans-serif' }}>
      {value}
    </div>
    <div className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</div>
  </div>
);

export default StatBadge;
