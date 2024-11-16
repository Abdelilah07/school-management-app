import React from 'react';
import PropTypes from 'prop-types';
import { X, Trash2 } from 'lucide-react';

const DetailView = ({
  title = 'Details',
  data,
  fields,
  onClose,
  onDelete,
  deleteButtonProps = {
    show: true,
    label: 'Delete',
    className: 'btn-error',
  },
  closeButtonProps = {
    show: true,
    label: 'Close',
    className: 'btn-ghost',
  },
  className = '',
}) => {
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="card bg-base-100">
        <div className="card-body p-4 space-y-6">
          {fields.map((field, index) => (
            <div key={index} className="flex items-start space-x-4">
              {field.icon && (
                <div className={field.iconClassName || 'text-primary'}>{field.icon}</div>
              )}
              <div className="flex-1">
                <h3 className={field.labelClassName || 'font-semibold text-base-content/70'}>
                  {field.label}
                </h3>
                <div className={field.valueClassName || 'text-lg'}>
                  {field.render ? field.render(data) : data[field.key]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-action mt-6">
        {closeButtonProps.show && (
          <button onClick={onClose} className={`btn gap-2 ${closeButtonProps.className}`}>
            {closeButtonProps.icon || <X className="w-4 h-4" />}
            {closeButtonProps.label}
          </button>
        )}
        {deleteButtonProps.show && (
          <button
            onClick={() => onDelete(data)}
            className={`btn gap-2 ${deleteButtonProps.className}`}
          >
            {deleteButtonProps.icon || <Trash2 className="w-4 h-4" />}
            {deleteButtonProps.label}
          </button>
        )}
      </div>
    </div>
  );
};

DetailView.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      iconClassName: PropTypes.string,
      labelClassName: PropTypes.string,
      valueClassName: PropTypes.string,
      render: PropTypes.func,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  deleteButtonProps: PropTypes.shape({
    show: PropTypes.bool,
    label: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.node,
  }),
  closeButtonProps: PropTypes.shape({
    show: PropTypes.bool,
    label: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.node,
  }),
  className: PropTypes.string,
};

export default DetailView;
