export interface UnsavedChangesComponent {
  hasUnsavedChanges(): boolean;
  discardChanges(): void;
}
